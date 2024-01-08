import {Module} from "@nestjs/common";
import {TipsService} from "./tips.service";
import {TipsController} from "./tips.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
    controllers: [TipsController],
    providers: [TipsService],
    imports: [ServicesModule, UsersModule, CacheModule.register()],
    exports: [TipsService]
})
export class TipsModule{}
