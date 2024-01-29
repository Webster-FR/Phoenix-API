import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {JwtService} from "../../../common/services/jwt.service";
import {PrismaService} from "../../../common/services/prisma.service";
import {ConfigService} from "@nestjs/config";
import {CipherService} from "../../../common/services/cipher.service";
import {AtPayloadModel} from "./models/models/at-payload.model";
import {RtPayloadModel} from "./models/models/rt-payload.model";
import {TokenCacheService} from "../../cache/token-cache.service";
import {UserEntity} from "../users/models/entities/user.entity";
import {AccessTokenEntity} from "./models/entities/access-token.entity";
import {RefreshTokenEntity} from "./models/entities/refresh-token.entity";
import {TokenPairModel} from "./models/models/token-pair.model";
import {TokenEntity} from "./models/entities/token.entity";

@Injectable()
export class TokensService{
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly encryptionService: CipherService,
        private readonly cacheService: TokenCacheService
    ){}

    async maxSessionCheck(user: UserEntity){
        const atCount = await this.prismaService.accessTokens.count({
            where: {
                user_id: user.id,
                blacklisted: false,
                expires: {
                    gt: new Date(),
                },
            },
        });
        if(atCount >= this.configService.get("MAX_SESSIONS"))
            throw new ForbiddenException("Max sessions reached");
    }

    async generateAccessToken(user: UserEntity, refreshTokenId: number = null): Promise<AccessTokenEntity>{
        await this.maxSessionCheck(user);
        const payload = new AtPayloadModel(user.id, this.encryptionService.generateSecret());
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("AT_DURATION"), this.configService.get("AT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const aToken: AccessTokenEntity = await this.prismaService.accessTokens.create({
            data: {
                user_id: user.id,
                sum: sum,
                token: await this.encryptionService.hash(token, 10),
                expires: new Date(expires * 1000),
                refresh_token_id: refreshTokenId,
            }
        });
        aToken.token = token;
        await this.cacheService.addToken(aToken, false);
        return aToken;
    }

    async generateRefreshToken(user: UserEntity): Promise<TokenPairModel>{
        await this.maxSessionCheck(user);
        const payload = new RtPayloadModel(user.id, this.encryptionService.generateSecret());
        const token = this.jwtService.generateJWT({...payload}, this.configService.get("RT_DURATION"), this.configService.get("RT_KEY"));
        const expires = (<any>this.jwtService.decodeJwt(token)).exp;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        const rToken: RefreshTokenEntity = await this.prismaService.refreshTokens.create({
            data: {
                user_id: user.id,
                sum,
                token: await this.encryptionService.hash(token, 10),
                expires: new Date(expires * 1000)
            }
        });
        rToken.token = token;
        const aToken = await this.generateAccessToken(user, rToken.id);
        await this.cacheService.addToken(rToken, true);
        await this.cacheService.addToken(aToken, false);
        return {accessToken: aToken, refreshToken: rToken};
    }

    async getTokenEntity(token: string, isRefresh: boolean, exception: boolean = true): Promise<TokenEntity>{
        const cachedToken = await this.cacheService.getTokenFromString(token, isRefresh);
        if(cachedToken)
            return cachedToken;
        const sum = this.encryptionService.getSum(token).substring(0, 10);
        let dbToken: TokenEntity;
        if(isRefresh){
            dbToken = await this.prismaService.refreshTokens.findFirst({
                where: {
                    sum: sum,
                }
            });
        }else{
            dbToken = await this.prismaService.accessTokens.findFirst({
                where: {
                    sum: sum,
                }
            });
        }
        if(!dbToken)
            if(exception)
                throw new NotFoundException("Token not found");
            else
                return null;
        if(await this.encryptionService.compareHash(dbToken.token, token)){
            const tempToken = dbToken;
            tempToken.token = token;
            await this.cacheService.addToken(tempToken, isRefresh);
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
        if(isRefresh){
            const rt = dbToken as RefreshTokenEntity;
            await this.prismaService.refreshTokens.update({
                where: {
                    id: rt.id,
                },
                data: {
                    blacklisted: true,
                },
            });
            await this.prismaService.accessTokens.update({
                where: {
                    refresh_token_id: rt.id,
                },
                data: {
                    blacklisted: true,
                },
            });
        }else{
            const at = dbToken as AccessTokenEntity;
            await this.prismaService.accessTokens.update({
                where: {
                    id: dbToken.id,
                },
                data: {
                    blacklisted: true,
                },
            });
            if(at.refresh_token_id){
                await this.prismaService.refreshTokens.update({
                    where: {
                        id: at.refresh_token_id,
                    },
                    data: {
                        blacklisted: true,
                    },
                });
            }
        }
        await this.cacheService.blackListToken(token, isRefresh);
        return true;
    }

    async blacklistUserTokens(user: UserEntity){
        await this.prismaService.refreshTokens.updateMany({
            where: {
                user_id: user.id,
            },
            data: {
                blacklisted: true,
            },
        });
        await this.prismaService.accessTokens.updateMany({
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
        const rRes = await this.prismaService.refreshTokens.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
            },
        });
        const aRes = await this.prismaService.accessTokens.deleteMany({
            where: {
                expires: {
                    lt: new Date(),
                },
                refresh_token_id: null,
            },
        });
        await this.cacheService.deleteExpiredTokens();
        return rRes.count + aRes.count;
    }
}
