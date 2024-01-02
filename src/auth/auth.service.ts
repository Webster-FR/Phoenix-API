import {BadRequestException, ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {EncryptionService} from "../services/encryption.service";
import {CtResponse} from "./models/responses/ct.response";
import {AtRtResponse} from "./models/responses/atrt.response";
import {TokensService} from "../services/tokens.service";
import {AtResponse} from "./models/responses/at.response";
import {EmailService} from "../services/email.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class AuthService{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: EncryptionService,
        private readonly tokensService: TokensService,
        private readonly emailService: EmailService,
        private readonly usersService: UsersService,
    ){}

    generateConfirmationCode(): string{
        return String(Math.floor(100000 + Math.random() * 900000));
    }

    async loginUser(email: string, password: string, keepLoggedIn: boolean): Promise<AtRtResponse | CtResponse>{
        const user = await this.usersService.findByEmail(email);
        if(!await this.encryptionService.compareHash(user.password, password))
            throw new BadRequestException("Invalid password");
        if(user.verification_code_id){
            const confirmationToken = await this.tokensService.generateConfirmationToken(user.id, keepLoggedIn);
            return new CtResponse(confirmationToken);
        }
        const accessToken = await this.tokensService.generateAccessToken(user.id);
        if(keepLoggedIn){
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
        await this.prismaService.tokens.updateMany({
            where: {
                user_id: userId,
            },
            data: {
                blacklisted: true,
            },
        });
    }

    async registerUser(username: string, email: string, password: string): Promise<CtResponse>{
        const user = await this.usersService.findByEmail(email, false);
        if(user)
            throw new ConflictException("Email already exists");
        const userSecret = this.encryptionService.generateSecret();
        const passwordHash = await this.encryptionService.hash(password);
        const code = this.generateConfirmationCode();
        const verificationCode = await this.prismaService.verificationCodes.create({
            data: {
                code,
                iat: new Date()
            },
        });
        const newUser = await this.prismaService.user.create({
            data: {
                username: username,
                email: email,
                password: passwordHash,
                secret: userSecret,
                verification_code_id: verificationCode.id,
            },
        });
        await this.emailService.sendConfirmationEmail(newUser.email, code);
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

    async confirmAccount(userId: number, code: string, keepLoggedIn: boolean){
        const dbUser = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
        });
        if(!dbUser)
            throw new NotFoundException("User not found");
        if(!dbUser.verification_code_id)
            throw new BadRequestException("User already confirmed");
        const dbCode = await this.prismaService.verificationCodes.findUnique({
            where: {
                id: dbUser.verification_code_id,
            },
        });
        if(!dbCode)
            throw new NotFoundException("Verification code not found");
        if(dbCode.code !== code)
            throw new BadRequestException("Invalid confirmation code");
        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                verification_code_id: null,
            },
        });
        await this.prismaService.verificationCodes.delete({
            where: {
                id: dbCode.id,
            },
        });
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
        const newCode = this.generateConfirmationCode();
        await this.prismaService.verificationCodes.update({
            where: {
                id: user.verification_code_id,
            },
            data: {
                code: newCode,
            },
        });
        await this.emailService.sendConfirmationEmail(user.email, newCode);
        return new CtResponse(await this.tokensService.generateConfirmationToken(user.id, false));
    }
}
