import {Module} from "@nestjs/common";
import {SecretsService} from "./secrets.service";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../users/users.module";
import {TodosModule} from "../../todos/todos/todos.module";
import {AccountsModule} from "../../accounting/accounts/accounts.module";
import {LedgersModule} from "../../accounting/ledgers/ledgers.module";

@Module({
    providers: [SecretsService],
    exports: [SecretsService],
    imports: [ServicesModule, UsersModule, TodosModule, AccountsModule, LedgersModule],
})
export class SecretsModule{}
