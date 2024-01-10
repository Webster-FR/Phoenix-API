import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {UserEntity} from "../users/models/entities/user.entity";
import {EncryptionService} from "../services/encryption.service";

@Injectable()
export class UserCacheService{

    constructor(
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getUsers(){
        let users = await this.cacheManager.get<UserEntity[]>("users");
        if(!users)
            users = [];
        return users;
    }

    async getUserFromId(userId: number): Promise<UserEntity>{
        const users: UserEntity[] = await this.getUsers();
        return users.find(u => u.id === userId);
    }

    async getUserFromEmail(email: string): Promise<UserEntity>{
        const users: UserEntity[] = await this.getUsers();
        return users.find(u => u.email === email);
    }

    async updateUser(user: UserEntity){
        const users: UserEntity[] = await this.getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if(userIndex === -1)
            users.push(user);
        else
            users[userIndex] = user;
        await this.cacheManager.set("users", users, 0);
    }

    async deleteUser(user: UserEntity){
        const users: UserEntity[] = await this.getUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if(userIndex !== -1)
            users.splice(userIndex, 1);
        await this.cacheManager.set("users", users, 0);
    }

    async deleteManyUsers(users: UserEntity[]){
        const cachedUsers: UserEntity[] = await this.getUsers();
        const usersToCache: UserEntity[] = cachedUsers.filter(cachedUser => !users.find(user => user.id === cachedUser.id));
        await this.cacheManager.set("users", usersToCache, 0);
    }
}
