import {Module} from "@nestjs/common";
import {TransactionsService} from "./transactions.service";
import {TransactionsController} from "./transactions.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {TransactionCategoriesService} from "./transaction-categories.service";

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService, TransactionCategoriesService],
    imports: [ServicesModule, UsersModule]
})
export class TransactionsModule{}
