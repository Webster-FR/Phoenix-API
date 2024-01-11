import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import {EmailService} from "../../../common/services/email.service";
import {AuthService} from "../auth/auth.service";
import {PrismaService} from "../../../common/services/prisma.service";
import {UserEntity} from "../users/models/entities/user.entity";
import {ConfigService} from "@nestjs/config";
import {EncryptionService} from "../../../common/services/encryption.service";
import {RecoveryCodeEntity} from "./models/entities/recovery-code.entity";

@Injectable()
export class PasswordRecoveryService{

    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
        private readonly authService: AuthService,
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
    ){}

    checkCode(verificationCode: RecoveryCodeEntity, code: string): boolean{
        if(!verificationCode)
            return false;
        return this.checkCodeValidity(verificationCode) && verificationCode.code === code;
    }

    checkCodeValidity(verificationCode: RecoveryCodeEntity): boolean{
        if (!verificationCode)
            return false;
        const now = new Date();
        const iat = new Date(verificationCode.iat);
        const validUntil = new Date(iat.getTime() + (this.configService.get<number>("PR_DURATION") * 60000));
        return now <= validUntil;
    }

    async sendRecoveryEmail(email: string){
        const user = await this.usersService.findByEmail(email);
        await this.prismaService.passwordRecoveryCodes.deleteMany({
            where: {
                user_id: user.id
            }
        });
        const code = this.encryptionService.generateSecret();
        await this.prismaService.passwordRecoveryCodes.create({
            data: {
                user_id: user.id,
                code: code,
                iat: new Date(),
            }
        });
        await this.emailService.sendPasswordRecoveryEmail(email, code);
    }

    async resetPassword(code: string, password: string){
        const recoveryCode = await this.prismaService.passwordRecoveryCodes.findUnique({
            include: {
                user: true
            },
            where: {
                code: code
            }
        });
        if(!recoveryCode)
            throw new NotFoundException("No user found with this recovery code");
        const user: UserEntity = recoveryCode.user;
        if(!user)
            throw new NotFoundException("No user found with this recovery code");
        if(!this.checkCode(recoveryCode, code))
            throw new BadRequestException("Invalid recovery code");
        await this.usersService.updatePassword(user, password);
        await this.prismaService.passwordRecoveryCodes.deleteMany({
            where: {
                user_id: user.id,
                code: code
            }
        });
        await this.authService.logoutAll(user);
    }
}
