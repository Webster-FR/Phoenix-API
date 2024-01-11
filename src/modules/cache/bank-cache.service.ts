import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {EncryptionService} from "../../common/services/encryption.service";
import {BankEntity} from "../accounting/banks/models/entities/bank.entity";
import {UserEntity} from "../security/users/models/entities/user.entity";

@Injectable()
export class BankCacheService{

    constructor(
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getBanks(user: UserEntity): Promise<BankEntity[]>{
        const banks: BankEntity[] = await this.cacheManager.get(`banks-${user.id}`);
        const defaultBanks: BankEntity[] = await this.cacheManager.get("banks-null");
        if(!banks && !defaultBanks)
            return [];
        else if(!banks)
            return defaultBanks;
        else if(!defaultBanks)
            return banks;
        else
            return banks.concat(defaultBanks);
    }

    async getBank(user: UserEntity, bankId: number): Promise<BankEntity>{
        const banks: BankEntity[] = await this.getBanks(user);
        for(const bank of banks)
            if(bank.id === bankId)
                return bank;
        return null;
    }

    async setBanks(user: UserEntity, banks: BankEntity[]): Promise<void>{
        for(const bank of banks)
            if(bank.user_id === user.id){
                const userBanks: BankEntity[] = banks.filter(b => b.user_id === user.id);
                await this.cacheManager.set(`banks-${user.id}`, userBanks, 0);
            }else{
                const defaultBanks: BankEntity[] = banks.filter(b => b.user_id === null);
                await this.cacheManager.set("banks-null", defaultBanks, 0);
            }
    }

    async addBank(user: UserEntity, bank: BankEntity): Promise<void>{
        const banks: BankEntity[] = await this.cacheManager.get(`banks-${user.id}`);
        if(!banks)
            await this.cacheManager.set(`banks-${user.id}`, [bank], 0);
        else
            await this.cacheManager.set(`banks-${user.id}`, banks.concat(bank), 0);
    }

    async updateBank(user: UserEntity, bank: BankEntity): Promise<void>{
        const banks: BankEntity[] = await this.cacheManager.get(`banks-${user.id}`);
        for(let i = 0; i < banks.length; i++)
            if(banks[i].id === bank.id){
                banks[i] = bank;
                await this.cacheManager.set(`banks-${user.id}`, banks, 0);
                return;
            }
    }

    async deleteBank(user: UserEntity, bank: BankEntity): Promise<void>{
        const banks: BankEntity[] = await this.cacheManager.get(`banks-${user.id}`);
        for(let i = 0; i < banks.length; i++)
            if(banks[i].id === bank.id){
                banks.splice(i, 1);
                await this.cacheManager.set(`banks-${user.id}`, banks, 0);
                return;
            }
    }
}
