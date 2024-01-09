import {Inject, Injectable, InternalServerErrorException} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {UserEntity} from "../users/models/entities/user.entity";
import {TokenEntity} from "../auth/models/entities/token.entity";
import {EncryptionService} from "../services/encryption.service";
import {CachedTokenEntity} from "../auth/models/entities/cached-token.entity";

@Injectable()
export class CacheService{

    constructor(
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getUserFromId(userId: number): Promise<UserEntity>{
        const users: UserEntity[] = await this.cacheManager.get<UserEntity[]>("users");
        return users.find(u => u.id === userId);
    }

    async getUserFromEmail(email: string): Promise<UserEntity>{
        const users: UserEntity[] = await this.cacheManager.get<UserEntity[]>("users");
        return users.find(u => u.email === email);
    }

    async updateUser(user: UserEntity){
        const users: UserEntity[] = await this.cacheManager.get<UserEntity[]>("users");
        const userIndex = users.findIndex(u => u.id === user.id);
        if(userIndex === -1)
            users.push(user);
        else
            users[userIndex] = user;
        await this.cacheManager.set("users", users, 0);
    }

    async deleteUser(user: UserEntity){
        const users: UserEntity[] = await this.cacheManager.get<UserEntity[]>("users");
        const userIndex = users.findIndex(u => u.id === user.id);
        if(userIndex !== -1)
            users.splice(userIndex, 1);
        await this.cacheManager.set("users", users, 0);
    }

    async deleteManyUsers(users: UserEntity[]){
        const cachedUsers: UserEntity[] = await this.cacheManager.get<UserEntity[]>("users");
        const usersToCache: UserEntity[] = cachedUsers.filter(cachedUser => !users.find(user => user.id === cachedUser.id));
        await this.cacheManager.set("users", usersToCache, 0);
    }



    async getTokenFromString(token: string): Promise<TokenEntity>{
        const tokens: TokenEntity[] = await this.cacheManager.get<TokenEntity[]>("tokens");
        return tokens.find(t => t.token === token);
    }

    async addToken(token: TokenEntity){
        if(token.token.startsWith("$argon"))
            throw new InternalServerErrorException("Cannot cache hashed token");
        if(token.sum.length < 10)
            throw new InternalServerErrorException("Cannot cache token with sum less than 10 characters");
        const tokens: TokenEntity[] = await this.cacheManager.get<TokenEntity[]>("tokens");
        tokens.push(token);
        await this.cacheManager.set("tokens", tokens, 0);
    }

    async blackListToken(token: string){
        const tokens: TokenEntity[] = await this.cacheManager.get<TokenEntity[]>("tokens");
        const tokenIndex = tokens.findIndex(t => t.token === token);
        if(tokenIndex !== -1){
            tokens[tokenIndex].blacklisted = true;
            await this.cacheManager.set("tokens", tokens, 0);
        }
    }

    async blackListUserTokens(user: UserEntity){
        const tokens: TokenEntity[] = await this.cacheManager.get<TokenEntity[]>("tokens");
        const tokensToKeep = tokens.filter(t => t.user_id !== user.id);
        await this.cacheManager.set("tokens", tokensToKeep, 0);
    }

    async deleteExpiredTokens(){
        const tokens = await this.cacheManager.get<TokenEntity[]>("tokens");
        const tokensToKeep = tokens.filter(t => t.expires > new Date());
        await this.cacheManager.set("tokens", tokensToKeep, 0);
    }


}
