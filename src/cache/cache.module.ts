import {Module} from "@nestjs/common";
import {TokenCacheService} from "./token-cache.service";
import {ServicesModule} from "../services/services.module";
import {UserCacheService} from "./user-cache.service";
import {TipsCacheService} from "./tips-cache.service";

@Module({
    providers: [TokenCacheService, UserCacheService, TipsCacheService],
    imports: [ServicesModule],
    exports: [TokenCacheService, UserCacheService, TipsCacheService]
})
export class CacheModule{}
