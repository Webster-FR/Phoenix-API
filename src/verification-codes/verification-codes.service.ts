import {VerificationCodeEntity} from "./models/entities/verification-code.entity";
import {EncryptionService} from "../services/encryption.service";
import {PrismaService} from "../services/prisma.service";
import {ConfigService} from "@nestjs/config";
import {Injectable} from "@nestjs/common";

@Injectable()
export class VerificationCodesService{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
    ){}

    async checkCode(verificationCodeId: number, code: string): Promise<boolean>{
        const verificationCode = await this.prismaService.verificationCodes.findUnique({where: {id: verificationCodeId}});
        if(!verificationCode)
            return false;
        return await this.checkCodeValidity(verificationCodeId) && verificationCode.code === code;
    }

    async checkCodeValidity(verificationCodeId: number): Promise<boolean>{
        const verificationCode: VerificationCodeEntity = await this.prismaService.verificationCodes.findUnique({where: {id: verificationCodeId}});
        if (!verificationCode)
            return false;
        const now = new Date();
        const iat = new Date(verificationCode.iat);
        const validUntil = new Date(iat.getTime() + (this.configService.get<number>("VC_DURATION") * 60000));
        return now <= validUntil;
    }

    async generateNewCode(verificationCodeId?: number): Promise<VerificationCodeEntity>{
        const newCode = this.encryptionService.generateSecret();
        if(verificationCodeId){
            return this.prismaService.verificationCodes.update({
                where: {
                    id: verificationCodeId,
                },
                data: {
                    code: newCode,
                    iat: new Date(),
                },
            });
        }else{
            return this.prismaService.verificationCodes.create({
                data: {
                    code: newCode,
                    iat: new Date(),
                },
            });
        }
    }

    async findById(id: number): Promise<VerificationCodeEntity>{
        return this.prismaService.verificationCodes.findUnique({where: {id: id}});
    }

    async findByCode(code: string): Promise<VerificationCodeEntity>{
        return this.prismaService.verificationCodes.findUnique({where: {code: code}});
    }

    async deleteById(id: number): Promise<VerificationCodeEntity>{
        return this.prismaService.verificationCodes.delete({where: {id: id}});
    }
}
