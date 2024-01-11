import {Module} from "@nestjs/common";
import {BanksService} from "./banks.service";
import {BanksController} from "./banks.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../../security/users/users.module";
import {AuthModule} from "../../security/auth/auth.module";
import {CacheModule} from "../../cache/cache.module";

@Module({
    controllers: [BanksController],
    providers: [BanksService],
    imports: [ServicesModule, UsersModule, AuthModule, CacheModule],
    exports: [BanksService],
})
export class BanksModule{}
