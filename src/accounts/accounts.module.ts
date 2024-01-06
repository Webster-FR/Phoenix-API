import {Module} from "@nestjs/common";
import {AccountsService} from "./accounts.service";
import {AccountsController} from "./accounts.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {BanksModule} from "../banks/banks.module";

@Module({
    controllers: [AccountsController],
    providers: [AccountsService],
    imports: [ServicesModule, UsersModule, BanksModule],
})
export class AccountsModule{}
