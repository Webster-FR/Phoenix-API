import {Module} from "@nestjs/common";
import {BanksService} from "./banks.service";
import {BanksController} from "./banks.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";

@Module({
    controllers: [BanksController],
    providers: [BanksService],
    imports: [ServicesModule, UsersModule],
})
export class BanksModule{}
