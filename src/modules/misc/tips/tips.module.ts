import {Module} from "@nestjs/common";
import {TipsService} from "./tips.service";
import {TipsController} from "./tips.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../../security/users/users.module";
import {AuthModule} from "../../../auth/auth.module";
import {CacheModule} from "../../cache/cache.module";

@Module({
    controllers: [TipsController],
    providers: [TipsService],
    imports: [ServicesModule, UsersModule, CacheModule, AuthModule],
    exports: [TipsService]
})
export class TipsModule{}
