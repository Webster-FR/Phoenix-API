import {forwardRef, Module} from "@nestjs/common";
import {AccountsService} from "./accounts.service";
import {AccountsController} from "./accounts.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {BanksModule} from "../banks/banks.module";
import {TransactionsModule} from "../transactions/transactions.module";

@Module({
    controllers: [AccountsController],
    providers: [AccountsService],
    imports: [ServicesModule, UsersModule, BanksModule, forwardRef(() => TransactionsModule)],
    exports: [AccountsService],
})
export class AccountsModule{}
