import {Module} from "@nestjs/common";
import {TransactionsService} from "./transactions.service";
import {TransactionsController} from "./transactions.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {LedgersModule} from "../ledgers/ledgers.module";

@Module({
    controllers: [TransactionsController],
    providers: [TransactionsService],
    imports: [ServicesModule, UsersModule, LedgersModule]
})
export class TransactionsModule{}
