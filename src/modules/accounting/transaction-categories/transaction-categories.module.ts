import {Module} from "@nestjs/common";
import {TransactionCategoriesService} from "./transaction-categories.service";
import {TransactionCategoriesController} from "./transaction-categories.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../../security/users/users.module";
import {AuthModule} from "../../../auth/auth.module";

@Module({
    controllers: [TransactionCategoriesController],
    providers: [TransactionCategoriesService],
    imports: [ServicesModule, UsersModule, AuthModule],
    exports: [TransactionCategoriesService],
})
export class TransactionCategoriesModule{}
