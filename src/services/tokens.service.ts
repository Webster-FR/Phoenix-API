import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {JwtService} from "./jwt.service";
import {PrismaService} from "./prisma.service";
import {ConfigService} from "@nestjs/config";
import {EncryptionService} from "./encryption.service";
import {AtPayloadModel} from "../auth/models/models/at-payload.model";
import {RtPayloadModel} from "../auth/models/models/rt-payload.model";
import {TokenEntity} from "../auth/models/entities/token.entity";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";

@Injectable()
export class TokensService{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){
        cacheManager.set("tokens", []).then(r => r);
    }

    async getTokenFromCache(token: string): Promise<TokenEntity>{
        const tokens = await this.cacheManager.get<TokenEntity[]>("tokens");
        if(!tokens)
            return null;
        for(const dbToken of tokens)
            if(await this.encryptionService.compareHash(dbToken.token, token)){
                return dbToken;
            }
        return null;
    }

    async blacklistTokenInCache(token: TokenEntity, blacklisted: boolean){
        const tokens = await this.cacheManager.get<TokenEntity[]>("tokens");
        const index = tokens.findIndex(t => t.id == token.id);
        tokens[index].blacklisted = blacklisted;
        await this.cacheManager.set("tokens", tokens, 0);
    }

    async generateAccessToken(userId: number): Promise<string>{
        const payload = new AtPayloadModel(userId, this.encryptionService.generateSecret());
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("AT_DURATION"), this.configService.get("AT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const dbToken: TokenEntity = await this.prismaService.tokens.create({
            data: {
                user_id: userId,
                sum: sum,
                token: await this.encryptionService.hash(token, 6),
                is_refresh: false,
                expires: new Date(expires * 1000)
            }
        });
        await this.cacheManager.set("tokens", [...(await this.cacheManager.get<any[]>("tokens")), dbToken]);
        return token;
    }

    async generateRefreshToken(userId: number): Promise<string>{
        const payload = new RtPayloadModel(userId, this.encryptionService.generateSecret());
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("RT_DURATION"), this.configService.get("RT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const dbToken: TokenEntity = await this.prismaService.tokens.create({
            data: {
                user_id: userId,
                sum,
                token: await this.encryptionService.hash(token, 6),
                is_refresh: true,
                expires: new Date(expires * 1000)
            }
        });
        await this.cacheManager.set("tokens", [...(await this.cacheManager.get<TokenEntity[]>("tokens")), dbToken]);
        return token;
    }

    async getTokenEntity(token: string, isRefresh: boolean, exception: boolean = true): Promise<TokenEntity>{
        const cachedToken = await this.getTokenFromCache(token);
        if(cachedToken)
            return cachedToken;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const tokens = await this.prismaService.tokens.findMany({
            where: {
                sum: sum,
                is_refresh: isRefresh,
            },
        });
        if(!tokens && exception)
            throw new NotFoundException("Token not found");
        for(const dbToken of tokens)
            if(await this.encryptionService.compareHash(dbToken.token, token)){
                await this.cacheManager.set("tokens", [...(await this.cacheManager.get<TokenEntity[]>("tokens")), dbToken], 0);
                return dbToken;
            }
        if(exception)
            throw new NotFoundException("Token not found");
        else
            return null;
    }

    async blacklistToken(token: string, isRefresh: boolean, exception: boolean = true){
        const dbToken = await this.getTokenEntity(token, isRefresh, exception);
        if(!exception && !dbToken)
            return false;
        await this.prismaService.tokens.update({
            where: {
                id: dbToken.id,
            },
            data: {
                blacklisted: true,
            },
        });
        await this.blacklistTokenInCache(dbToken, true);
        return true;
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
        const tokens = await this.cacheManager.get<TokenEntity[]>("tokens");
        for(const token of tokens)
            if(token.user_id == userId)
                await this.blacklistTokenInCache(token, true);
    }

    async deleteExpiredTokens(){
        const {count} = await this.prismaService.tokens.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });
        await this.cacheManager.set("tokens", (await this.cacheManager.get<TokenEntity[]>("tokens")).filter(t => t.expires > new Date()), 0);
        return count;
    }
}
