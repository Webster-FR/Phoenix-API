import {Inject, Injectable, InternalServerErrorException} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {UserEntity} from "../security/users/models/entities/user.entity";
import {TokenEntity} from "../../auth/models/entities/token.entity";
import {EncryptionService} from "../../common/services/encryption.service";

@Injectable()
export class TokenCacheService{

    constructor(
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getTokens(){
        let tokens = await this.cacheManager.get<TokenEntity[]>("tokens");
        if(!tokens)
            tokens = [];
        return tokens;
    }

    async getTokenFromString(token: string): Promise<TokenEntity>{
        const tokens: TokenEntity[] = await this.getTokens();
        return tokens.find(t => t.token === token);
    }

    async addToken(token: TokenEntity){
        if(token.token.startsWith("$argon"))
            throw new InternalServerErrorException("Cannot cache hashed token");
        if(token.sum.length < 10)
            throw new InternalServerErrorException("Cannot cache token with sum less than 10 characters");
        const tokens: TokenEntity[] = await this.getTokens();
        tokens.push(token);
        await this.cacheManager.set("tokens", tokens, 0);
    }

    async blackListToken(token: string){
        const tokens: TokenEntity[] = await this.getTokens();
        const tokenIndex = tokens.findIndex(t => t.token === token);
        if(tokenIndex !== -1){
            tokens[tokenIndex].blacklisted = true;
            await this.cacheManager.set("tokens", tokens, 0);
        }
    }

    async blackListUserTokens(user: UserEntity){
        const tokens: TokenEntity[] = await this.getTokens();
        const tokensToKeep = tokens.filter(t => t.user_id !== user.id);
        await this.cacheManager.set("tokens", tokensToKeep, 0);
    }

    async deleteExpiredTokens(){
        const tokens = await this.getTokens();
        const tokensToKeep = tokens.filter(t => t.expires > new Date());
        await this.cacheManager.set("tokens", tokensToKeep, 0);
    }
}
