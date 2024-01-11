import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {EncryptionService} from "../../common/services/encryption.service";

@Injectable()
export class BankCacheService{

    constructor(
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}


}
