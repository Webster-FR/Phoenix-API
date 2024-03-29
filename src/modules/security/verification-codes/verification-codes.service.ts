import {Injectable, NotFoundException} from "@nestjs/common";
import {VerificationCodeEntity} from "./models/entities/verification-code.entity";
import {PrismaService} from "../../../common/services/prisma.service";
import {ConfigService} from "@nestjs/config";
import {UserEntity} from "../users/models/entities/user.entity";

@Injectable()
export class VerificationCodesService{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
    ){}

    async checkCode(verificationCode: VerificationCodeEntity, code: string): Promise<boolean>{
        if(!verificationCode)
            return false;
        return await this.checkCodeValidity(verificationCode) && verificationCode.code === code;
    }

    async checkCodeValidity(verificationCode: VerificationCodeEntity): Promise<boolean>{
        if (!verificationCode)
            return false;
        const now = new Date();
        const iat = new Date(verificationCode.iat);
        const validUntil = new Date(iat.getTime() + (this.configService.get<number>("VC_DURATION") * 60000));
        return now <= validUntil;
    }

    async findById(id: number): Promise<VerificationCodeEntity>{
        return this.prismaService.verificationCodes.findUnique({where: {id: id}});
    }

    async findByUserId(userId: number): Promise<VerificationCodeEntity>{
        return this.prismaService.verificationCodes.findUnique({where: {user_id: userId}});
    }

    async deleteById(id: number): Promise<VerificationCodeEntity>{
        if(!await this.findById(id))
            throw new NotFoundException("Code not found");
        return this.prismaService.verificationCodes.delete({where: {id: id}});
    }

    async createCode(user: UserEntity, code: string): Promise<VerificationCodeEntity>{
        return this.prismaService.verificationCodes.create({
            data: {
                user_id: user.id,
                code: code,
                iat: new Date(),
            },
        });
    }

    async setCode(user: UserEntity, code: VerificationCodeEntity, newCode: string): Promise<VerificationCodeEntity>{
        return this.prismaService.verificationCodes.update({
            where: {
                id: code.id,
                user_id: user.id,
            },
            data: {
                code: newCode,
                iat: new Date(),
            },
        });
    }

    async invalidateCode(code: string){
        await this.prismaService.verificationCodes.update({
            where: {
                code: code,
            },
            data: {
                iat: new Date(0),
            },
        });
    }
}
