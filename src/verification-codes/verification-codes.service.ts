import {Injectable} from "@nestjs/common";
import {VerificationCodeEntity} from "../users/models/entities/verification-code.entity";
import {PrismaService} from "../services/prisma.service";

@Injectable()
export class VerificationCodesService{

    constructor(
        private readonly prismaService: PrismaService,
    ){}

    generateConfirmationCode(): string{
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    async generateNewCode(verificationCodeId?: number): Promise<VerificationCodeEntity>{
        const newCode = this.generateConfirmationCode();
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

    async deleteById(id: number): Promise<VerificationCodeEntity>{
        return this.prismaService.verificationCodes.delete({where: {id: id}});
    }
}
