import {Inject, Injectable, InternalServerErrorException} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {UserEntity} from "../security/users/models/entities/user.entity";
import {TokenEntity} from "../security/auth/models/entities/token.entity";
import {RefreshTokenEntity} from "../security/auth/models/entities/refresh-token.entity";
import {AccessTokenEntity} from "../security/auth/models/entities/access-token.entity";

@Injectable()
export class TokenCacheService{

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getAccessTokens(){
        let tokens = await this.cacheManager.get<AccessTokenEntity[]>("access_tokens");
        if(!tokens)
            tokens = [];
        return tokens;
    }

    async getRefreshTokens(){
        let tokens = await this.cacheManager.get<RefreshTokenEntity[]>("refresh_tokens");
        if(!tokens)
            tokens = [];
        return tokens;
    }

    async getTokens(isRefresh: boolean){
        const key = isRefresh ? "refresh_tokens" : "access_tokens";
        let tokens = await this.cacheManager.get<TokenEntity[]>(key);
        if(!tokens)
            tokens = [];
        return tokens;
    }

    async setTokens(tokens: TokenEntity[], isRefresh: boolean){
        const key = isRefresh ? "refresh_tokens" : "access_tokens";
        await this.cacheManager.set(key, tokens, 0);
    }

    async getTokenFromString(token: string, isRefresh: boolean): Promise<TokenEntity>{
        const tokens: TokenEntity[] = await this.getTokens(isRefresh);
        return tokens.find(t => t.token === token);
    }

    async addToken(token: TokenEntity, isRefresh: boolean){
        if(token.token.startsWith("$argon"))
            throw new InternalServerErrorException("Cannot cache hashed token");
        if(token.sum.length < 10)
            throw new InternalServerErrorException("Cannot cache token with sum less than 10 characters");
        const tokens: TokenEntity[] = await this.getTokens(isRefresh);
        tokens.push(token);
        await this.setTokens(tokens, isRefresh);
    }

    async blackListToken(token: string, isRefresh: boolean){
        const rTokens: RefreshTokenEntity[] = await this.getRefreshTokens();
        const aTokens: AccessTokenEntity[] = await this.getAccessTokens();
        if(isRefresh){
            const rTokenIndex = rTokens.findIndex(t => t.token === token);
            if(rTokenIndex !== -1){
                rTokens[rTokenIndex].blacklisted = true;
                await this.setTokens(rTokens, true);
                const aTokenIndex = aTokens.findIndex(t => t.refresh_token_id === rTokens[rTokenIndex].id);
                if(aTokenIndex !== -1){
                    aTokens[aTokenIndex].blacklisted = true;
                    await this.setTokens(aTokens, false);
                }
            }else
                throw new InternalServerErrorException("Token not found in cache");
        }else{
            const aTokenIndex = aTokens.findIndex(t => t.token === token);
            if(aTokenIndex !== -1){
                aTokens[aTokenIndex].blacklisted = true;
                await this.setTokens(aTokens, false);
                const rTokenIndex = rTokens.findIndex(t => t.id === aTokens[aTokenIndex].refresh_token_id);
                if(rTokenIndex !== -1){
                    rTokens[rTokenIndex].blacklisted = true;
                    await this.setTokens(rTokens, true);
                }
            }else
                throw new InternalServerErrorException("Token not found in cache");
        }
    }

    async blackListUserTokens(user: UserEntity){
        const rTokens: TokenEntity[] = await this.getTokens(true);
        for(let i = 0; i < rTokens.length; i++)
            if(rTokens[i].user_id === user.id)
                rTokens[i].blacklisted = true;
        await this.setTokens(rTokens, true);
        const aTokens: TokenEntity[] = await this.getTokens(false);
        for(let i = 0; i < aTokens.length; i++)
            if(aTokens[i].user_id === user.id)
                aTokens[i].blacklisted = true;
        await this.setTokens(aTokens, false);

    }

    async deleteExpiredTokens(){
        const rTokens = await this.getTokens(true);
        await this.setTokens(rTokens.filter(t => t.expires > new Date()), true);
        const aTokens = await this.getTokens(false);
        await this.setTokens(aTokens.filter(t => t.expires > new Date()), false);
    }
}
