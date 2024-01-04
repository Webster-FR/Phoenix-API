import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {EncryptionService} from "../services/encryption.service";
import {CtResponse} from "./models/responses/ct.response";
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

    async loginUser(email: string, password: string, keepLoggedIn: boolean): Promise<AtRtResponse | CtResponse>{
        const user = await this.usersService.findByEmail(email);
        if(!await this.encryptionService.compareHash(user.password, password))
            throw new BadRequestException("Invalid password");
        if(user.verification_code_id){
            const confirmationToken = await this.tokensService.generateConfirmationToken(user.id, keepLoggedIn);
            return new CtResponse(confirmationToken);
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

    async registerUser(username: string, email: string, password: string): Promise<CtResponse>{
        const user = await this.usersService.findByEmail(email, false);
        if(user)
            throw new ConflictException("Email already exists");
        const newUser = await this.usersService.createUser(username, email, password);
        const code = await this.verificationCodeService.findById(newUser.verification_code_id);
        await this.emailService.sendConfirmationEmail(newUser.email, code.code);
        const confirmationToken = await this.tokensService.generateConfirmationToken(newUser.id, false);
        return new CtResponse(confirmationToken);
    }

    async refresh(at: string, rt: string): Promise<AtRtResponse>{
        await this.tokensService.blacklistToken(at, false);
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

    async confirmAccount(userId: number, requestCode: string, keepLoggedIn: boolean){
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        if(!user.verification_code_id)
            throw new BadRequestException("User already confirmed");
        const dbCode = await this.verificationCodeService.findById(user.verification_code_id);
        if(!dbCode)
            throw new NotFoundException("Verification code not found");
        if(dbCode.code !== requestCode)
            throw new BadRequestException("Invalid confirmation code");
        // Check if code is valid
        const now = new Date();
        const iat = new Date(dbCode.iat);
        iat.setMinutes(iat.getMinutes() + this.configService.get<number>("VC_DURATION"));
        if(now > iat)
            throw new BadRequestException("Confirmation code expired");
        await this.usersService.clearVerificationCode(user.id);
        await this.verificationCodeService.deleteById(dbCode.id);
        const accessToken = await this.tokensService.generateAccessToken(userId);
        if(keepLoggedIn){
            const refreshToken = await this.tokensService.generateRefreshToken(userId);
            return new AtRtResponse(accessToken, refreshToken);
        }
        return new AtResponse(accessToken);
    }

    async resendConfirmationCode(userId: number){
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        if(!user.verification_code_id)
            throw new BadRequestException("User already confirmed");
        const newCode = await this.verificationCodeService.generateNewCode(user.verification_code_id);
        await this.usersService.setVerificationCode(user.id, newCode.id);
        await this.emailService.sendConfirmationEmail(user.email, newCode.code);
        return new CtResponse(await this.tokensService.generateConfirmationToken(user.id, false));
    }
}
