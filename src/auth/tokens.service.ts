import {Injectable, NotFoundException} from "@nestjs/common";
import {JwtService} from "../common/services/jwt.service";
import {PrismaService} from "../common/services/prisma.service";
import {ConfigService} from "@nestjs/config";
import {EncryptionService} from "../common/services/encryption.service";
import {AtPayloadModel} from "./models/models/at-payload.model";
import {RtPayloadModel} from "./models/models/rt-payload.model";
import {TokenEntity} from "./models/entities/token.entity";
import {TokenCacheService} from "../modules/cache/token-cache.service";
import {UserEntity} from "../users/models/entities/user.entity";

@Injectable()
export class TokensService{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly encryptionService: EncryptionService,
        private readonly cacheService: TokenCacheService
    ){}

    async generateAccessToken(user: UserEntity): Promise<string>{
        const payload = new AtPayloadModel(user.id, this.encryptionService.generateSecret());
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("AT_DURATION"), this.configService.get("AT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const dbToken: TokenEntity = await this.prismaService.tokens.create({
            data: {
                user_id: user.id,
                sum: sum,
                token: await this.encryptionService.hash(token, 6),
                is_refresh: false,
                expires: new Date(expires * 1000)
            }
        });
        dbToken.token = token;
        await this.cacheService.addToken(dbToken);
        return token;
    }

    async generateRefreshToken(user: UserEntity): Promise<string>{
        const payload = new RtPayloadModel(user.id, this.encryptionService.generateSecret());
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("RT_DURATION"), this.configService.get("RT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const dbToken: TokenEntity = await this.prismaService.tokens.create({
            data: {
                user_id: user.id,
                sum,
                token: await this.encryptionService.hash(token, 6),
                is_refresh: true,
                expires: new Date(expires * 1000)
            }
        });
        dbToken.token = token;
        await this.cacheService.addToken(dbToken);
        return token;
    }

    async getTokenEntity(token: string, isRefresh: boolean, exception: boolean = true): Promise<TokenEntity>{
        const cachedToken = await this.cacheService.getTokenFromString(token);
        if(cachedToken)
            return cachedToken;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const tokens: TokenEntity[] = await this.prismaService.tokens.findMany({
            where: {
                sum: sum,
                is_refresh: isRefresh,
            },
        });
        if(!tokens && exception)
            throw new NotFoundException("Token not found");
        for(const dbToken of tokens)
            if(await this.encryptionService.compareHash(dbToken.token, token)){
                const tempToken = dbToken;
                tempToken.token = token;
                await this.cacheService.addToken(tempToken);
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
        await this.cacheService.blackListToken(token);
        return true;
    }

    async blacklistUserTokens(user: UserEntity){
        await this.prismaService.tokens.updateMany({
            where: {
                user_id: user.id,
            },
            data: {
                blacklisted: true,
            },
        });
        await this.cacheService.blackListUserTokens(user);
    }

    async deleteExpiredTokens(){
        const {count} = await this.prismaService.tokens.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });
        await this.cacheService.deleteExpiredTokens();
        return count;
    }
}
