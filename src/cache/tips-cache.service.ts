import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {EncryptionService} from "../services/encryption.service";
import {TipEntity} from "../tips/models/entities/tip.entity";

@Injectable()
export class TipsCacheService{

    constructor(
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getTip(): Promise<TipEntity>{
        const tip = await this.cacheManager.get<TipEntity>("tip");
        if(!tip)
            return null;
        if(tip.order !== new Date().getDate())
            return null;
        return tip;
    }

    async updateTip(tip: TipEntity): Promise<void>{
        const today = new Date();
        if(tip.order !== today.getDate())
            return;
        await this.cacheManager.set("tip", tip, 0);
    }
}
