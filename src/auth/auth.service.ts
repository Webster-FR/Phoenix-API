import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable, InternalServerErrorException,
    NotFoundException, UnauthorizedException
} from "@nestjs/common";
import {EncryptionService} from "../services/encryption.service";
import {AtRtResponse} from "./models/responses/atrt.response";
import {TokensService} from "../services/tokens.service";
import {AtResponse} from "./models/responses/at.response";
import {EmailService} from "../services/email.service";
import {UsersService} from "../users/users.service";
import {VerificationCodesService} from "../verification-codes/verification-codes.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly tokensService: TokensService,
        private readonly emailService: EmailService,
        private readonly usersService: UsersService,
        private readonly verificationCodeService: VerificationCodesService,
        private readonly configService: ConfigService
    ){}

    async loginUser(email: string, password: string, keepLoggedIn: boolean): Promise<AtRtResponse | AtResponse>{
        const user = await this.usersService.findByEmail(email);
        if(!await this.encryptionService.compareHash(user.password, password))
            throw new UnauthorizedException("Invalid password");
        const code = await this.verificationCodeService.findByUserId(user.id);
        if(code){
            if(!await this.verificationCodeService.checkCodeValidity(code)){
                const newCode = this.encryptionService.generateSecret();
                await this.verificationCodeService.setCode(user.id, newCode);
                await this.emailService.sendConfirmationEmail(user.email, newCode);
                return null;
            }
            throw new ForbiddenException("Email not confirmed");
        }
        const accessToken = await this.tokensService.generateAccessToken(user.id);
        if(keepLoggedIn === true){
            const refreshToken = await this.tokensService.generateRefreshToken(user.id);
            return new AtRtResponse(accessToken, refreshToken);
        }
        return new AtRtResponse(accessToken);
    }

    async logout(at: string, rt?: string){
        await this.tokensService.blacklistToken(at, false);
        if(rt)
            await this.tokensService.blacklistToken(rt, true);
    }

    async logoutAll(userId: number){
        await this.tokensService.blacklistUserTokens(userId);
    }

    async registerUser(username: string, email: string, password: string): Promise<void>{
        const user = await this.usersService.findByEmail(email, false);
        if(user)
            throw new ConflictException("Email already exists");
        const newUser = await this.usersService.createUser(username, email, password);
        const code = await this.verificationCodeService.findByUserId(newUser.id);
        if(!code)
            throw new InternalServerErrorException("Verification code not found");
        await this.emailService.sendConfirmationEmail(newUser.email, code.code);
    }

    async refresh(at: string, rt: string): Promise<AtRtResponse>{
        await this.tokensService.blacklistToken(at, false, false);
        const rtDbToken = await this.tokensService.getTokenEntity(rt, true);
        if(rtDbToken.blacklisted){
            await this.logoutAll(rtDbToken.user_id);
            throw new ConflictException("Refresh token already used");
        }
        await this.tokensService.blacklistToken(rt, true);
        const accessToken = await this.tokensService.generateAccessToken(rtDbToken.user_id);
        const refreshToken = await this.tokensService.generateRefreshToken(rtDbToken.user_id);
        return new AtRtResponse(accessToken, refreshToken);
    }

    async confirmAccount(requestCode: string){
        const verificationCode = await this.verificationCodeService.findByCode(requestCode);
        if(!verificationCode)
            throw new NotFoundException("Verification code not found");
        const user = await this.usersService.findByVerificationCode(verificationCode.id);
        if(!user)
            throw new NotFoundException("No user found for this code");
        if(!await this.verificationCodeService.checkCode(verificationCode, requestCode))
            throw new BadRequestException("Invalid code");
        await this.verificationCodeService.deleteById(verificationCode.id);
    }
}
