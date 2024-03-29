import {Module} from "@nestjs/common";
import {TokenCacheService} from "./token-cache.service";
import {ServicesModule} from "../../common/services/services.module";
import {UserCacheService} from "./user-cache.service";
import {TipsCacheService} from "./tips-cache.service";
import {TodoCacheService} from "./todo-cache.service";
import {TodoListCacheService} from "./todo-list-cache.service";

@Module({
    providers: [TokenCacheService, UserCacheService, TipsCacheService, TodoCacheService, TodoListCacheService],
    imports: [ServicesModule],
    exports: [TokenCacheService, UserCacheService, TipsCacheService, TodoCacheService, TodoListCacheService]
})
export class CacheModule{}
