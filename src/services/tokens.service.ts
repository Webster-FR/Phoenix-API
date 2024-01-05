import {AtPayloadModel} from "../auth/models/models/at-payload.model";
import {CtPayloadModel} from "../auth/models/models/ct-payload.model";
import {RtPayloadModel} from "../auth/models/models/rt-payload.model";
import {TokenEntity} from "../auth/models/entities/token.entity";
import {Injectable, NotFoundException} from "@nestjs/common";
import {EncryptionService} from "./encryption.service";
import {PrismaService} from "./prisma.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "./jwt.service";


@Injectable()
export class TokensService{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService
    ){}

    async generateAccessToken(userId: number): Promise<string>{
        const payload = new AtPayloadModel(userId);
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("AT_DURATION"), this.configService.get("AT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        await this.prismaService.tokens.create({
            data: {
                user_id: userId,
                sum: this.encryptionService.getSum(token).substring(0, 10),
                token: await this.encryptionService.hash(token),
                is_refresh: false,
                expires: new Date(expires * 1000)
            }
        });
        return token;
    }

    async generateRefreshToken(userId: number): Promise<string>{
        const payload = new RtPayloadModel(userId);
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("RT_DURATION"), this.configService.get("RT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        await this.prismaService.tokens.create({
            data: {
                user_id: userId,
                sum: this.encryptionService.getSum(token).substring(0, 10),
                token: await this.encryptionService.hash(token),
                is_refresh: true,
                expires: new Date(expires * 1000)
            }
        });
        return token;
    }

    async generateConfirmationToken(userId: number, keepLoggedIn: boolean): Promise<string>{
        const payload = new CtPayloadModel(userId, keepLoggedIn);
        return this.jwtService.generateJWT({...payload}, this.configService.get<string>("VC_DURATION") + "m", this.configService.get("CT_KEY"));
    }

    async getTokenEntity(token: string, isRefresh: boolean): Promise<TokenEntity>{
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const tokens = await this.prismaService.tokens.findMany({
            where: {
                sum: sum,
                is_refresh: isRefresh,
            },
        });
        if(!tokens)
            throw new NotFoundException("Token not found");
        for(const dbToken of tokens)
            if(await this.encryptionService.compareHash(dbToken.token, token))
                return dbToken;
        throw new NotFoundException("Token not found");
    }

    async blacklistToken(token: string, isRefresh: boolean){
        const dbToken = await this.getTokenEntity(token, isRefresh);
        await this.prismaService.tokens.update({
            where: {
                id: dbToken.id,
            },
            data: {
                blacklisted: true,
            },
        });
    }

    async blacklistUserTokens(userId: number){
        await this.prismaService.tokens.updateMany({
            where: {
                user_id: userId,
            },
            data: {
                blacklisted: true,
            },
        });
    }

    async isTokenBlacklisted(token: string, isRefresh: boolean): Promise<boolean>{
        const dbToken = await this.getTokenEntity(token, isRefresh);
        return dbToken.blacklisted;
    }
}
