import {
    BadRequestException,
    ForbiddenException,
    Injectable, InternalServerErrorException,
    NotFoundException, PreconditionFailedException
} from "@nestjs/common";
import {EncryptionService} from "../common/services/encryption.service";
import {AtRtResponse} from "./models/responses/atrt.response";
import {TokensService} from "./tokens.service";
import {AtResponse} from "./models/responses/at.response";
import {EmailService} from "../common/services/email.service";
import {UsersService} from "../modules/security/users/users.service";
import {VerificationCodesService} from "../verification-codes/verification-codes.service";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../common/services/prisma.service";
import {UserEntity} from "../modules/security/users/models/entities/user.entity";
import {VerificationCodeEntity} from "../verification-codes/models/entities/verification-code.entity";

@Injectable()
export class AuthService{
    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly tokensService: TokensService,
        private readonly emailService: EmailService,
        private readonly usersService: UsersService,
        private readonly verificationCodeService: VerificationCodesService,
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService
    ){}

    async loginUser(email: string, password: string, keepLoggedIn: boolean): Promise<AtRtResponse | AtResponse>{
        const user = await this.prismaService.user.findUnique({
            include: {
                verification_codes: true
            },
            where: {
                email: email
            }
        });
        if(!user)
            throw new NotFoundException("User not found");
        if(!await this.encryptionService.compareHash(user.password, password))
            throw new ForbiddenException("Invalid password");
        if(user.verification_codes){
            if(!await this.verificationCodeService.checkCodeValidity(user.verification_codes)){
                const newCode = this.encryptionService.generateSecret();
                await this.verificationCodeService.setCode(user, user.verification_codes, newCode);
                await this.emailService.sendConfirmationEmail(user.email, newCode);
                return null;
            }
            throw new PreconditionFailedException("Email not confirmed");
        }
        const accessToken = await this.tokensService.generateAccessToken(user);
        if(keepLoggedIn === true){
            const refreshToken = await this.tokensService.generateRefreshToken(user);
            return new AtRtResponse(accessToken, refreshToken);
        }
        return new AtRtResponse(accessToken);
    }

    async logout(at: string, rt?: string){
        await this.tokensService.blacklistToken(at, false);
        if(rt)
            await this.tokensService.blacklistToken(rt, true);
    }

    async logoutAll(user: UserEntity){
        await this.tokensService.blacklistUserTokens(user);
    }

    async registerUser(username: string, email: string, password: string): Promise<void>{
        const newUser: UserEntity = await this.usersService.createUser(username, email, password);
        const code: VerificationCodeEntity = await this.verificationCodeService.findByUserId(newUser.id);
        if(!code)
            throw new InternalServerErrorException("Verification code not found");
        await this.emailService.sendConfirmationEmail(newUser.email, code.code);
    }

    async refresh(user: UserEntity, at: string, rt: string): Promise<AtRtResponse>{
        await this.tokensService.blacklistToken(at, false, false);
        await this.tokensService.blacklistToken(rt, true);
        const accessToken = await this.tokensService.generateAccessToken(user);
        const refreshToken = await this.tokensService.generateRefreshToken(user);
        return new AtRtResponse(accessToken, refreshToken);
    }

    async confirmAccount(requestCode: string){
        const verificationCode = await this.prismaService.verificationCodes.findUnique({
            include: {
                user: true
            },
            where: {
                code: requestCode
            }
        });
        if(!verificationCode)
            throw new NotFoundException("Verification code not found");
        const user: UserEntity = verificationCode.user;
        if(!user)
            throw new NotFoundException("No user found for this code");
        if(!await this.verificationCodeService.checkCode(verificationCode, requestCode))
            throw new BadRequestException("Invalid code");
        await this.verificationCodeService.deleteById(verificationCode.id);
    }
}
