import {Module} from "@nestjs/common";
import {TipsService} from "./tips.service";
import {TipsController} from "./tips.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {CacheModule} from "@nestjs/cache-manager";
import {AuthModule} from "../auth/auth.module";

@Module({
    controllers: [TipsController],
    providers: [TipsService],
    imports: [ServicesModule, UsersModule, CacheModule.register(), AuthModule],
    exports: [TipsService]
})
export class TipsModule{}
