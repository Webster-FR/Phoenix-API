import {Module} from "@nestjs/common";
import {BanksService} from "./banks.service";
import {BanksController} from "./banks.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../../../users/users.module";
import {AuthModule} from "../../../auth/auth.module";

@Module({
    controllers: [BanksController],
    providers: [BanksService],
    imports: [ServicesModule, UsersModule, AuthModule],
    exports: [BanksService],
})
export class BanksModule{}
