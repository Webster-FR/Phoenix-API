import {Module} from "@nestjs/common";
import {CacheService} from "./cache.service";
import {ServicesModule} from "../services/services.module";

@Module({
    providers: [CacheService],
    imports: [ServicesModule],
    exports: [CacheService]
})
export class CacheModule{}
