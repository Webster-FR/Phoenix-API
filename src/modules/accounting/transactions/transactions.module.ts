import {forwardRef, Module} from "@nestjs/common";
import {TransactionsService} from "./transactions.service";
import {TransactionsController} from "./transactions.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../../../users/users.module";
import {LedgersModule} from "../ledgers/ledgers.module";
import {AccountsModule} from "../accounts/accounts.module";
import {TransactionCategoriesModule} from "../transaction-categories/transaction-categories.module";
import {AuthModule} from "../../../auth/auth.module";

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [ServicesModule, UsersModule, LedgersModule, forwardRef(() => AccountsModule), TransactionCategoriesModule, AuthModule],
    exports: [TransactionsService],
})
export class TransactionsModule{}
