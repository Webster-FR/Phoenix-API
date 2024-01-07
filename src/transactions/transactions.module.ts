import {forwardRef, Module} from "@nestjs/common";
import {TransactionsService} from "./transactions.service";
import {TransactionsController} from "./transactions.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {LedgersModule} from "../ledgers/ledgers.module";
import {AccountsModule} from "../accounts/accounts.module";
import {TransactionCategoriesModule} from "../transaction-categories/transaction-categories.module";

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [ServicesModule, UsersModule, LedgersModule, forwardRef(() => AccountsModule), TransactionCategoriesModule],
    exports: [TransactionsService],
})
export class TransactionsModule{}
