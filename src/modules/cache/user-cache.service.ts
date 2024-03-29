import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {UserEntity} from "../security/users/models/entities/user.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UserCacheService{

    private readonly userCacheTtl = parseInt(this.configService.get("USER_CACHE_TTL"));

    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getUserFromId(userId: number): Promise<UserEntity>{
        return await this.cacheManager.get<UserEntity>(`user-${userId}`);
    }

    async updateUser(user: UserEntity){
        await this.cacheManager.set(`user-${user.id}`, user, this.userCacheTtl);
    }

    async deleteUser(user: UserEntity){
        await this.cacheManager.del(`user-${user.id}`);
    }

    async deleteManyUsers(users: UserEntity[]){
        for(const user of users)
            await this.cacheManager.del(`user-${user.id}`);
    }
}
