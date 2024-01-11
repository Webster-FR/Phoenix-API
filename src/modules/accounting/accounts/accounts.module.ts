import {forwardRef, Module} from "@nestjs/common";
import {AccountsService} from "./accounts.service";
import {AccountsController} from "./accounts.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../../security/users/users.module";
import {BanksModule} from "../banks/banks.module";
import {TransactionsModule} from "../transactions/transactions.module";
import {AuthModule} from "../../../auth/auth.module";

@Module({
    controllers: [AccountsController],
    providers: [AccountsService],
    imports: [ServicesModule, UsersModule, BanksModule, forwardRef(() => TransactionsModule), AuthModule],
    exports: [AccountsService],
})
export class AccountsModule{}
