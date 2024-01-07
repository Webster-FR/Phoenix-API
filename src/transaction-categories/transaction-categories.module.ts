import {Module} from "@nestjs/common";
import {TransactionCategoriesService} from "./transaction-categories.service";
import {TransactionCategoriesController} from "./transaction-categories.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";

@Module({
    controllers: [TransactionCategoriesController],
    providers: [TransactionCategoriesService],
    imports: [ServicesModule, UsersModule],
    exports: [TransactionCategoriesService],
})
export class TransactionCategoriesModule{}
