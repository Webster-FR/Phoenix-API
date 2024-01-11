import {Module} from "@nestjs/common";
import {AccountsModule} from "./accounts/accounts.module";
import {BanksModule} from "./banks/banks.module";
import {LedgersModule} from "./ledgers/ledgers.module";
import {TransactionCategoriesModule} from "./transaction-categories/transaction-categories.module";
import {TransactionsModule} from "./transactions/transactions.module";


@Module({
    imports: [AccountsModule, BanksModule, LedgersModule, TransactionCategoriesModule, TransactionsModule],
})
export class AccountingModule{}
