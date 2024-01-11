import {Module} from "@nestjs/common";
import {SecretsService} from "./secrets.service";
import {ServicesModule} from "../common/services/services.module";
import {UsersModule} from "../users/users.module";
import {TodosModule} from "../modules/todos/todos.module";
import {AccountsModule} from "../accounts/accounts.module";
import {LedgersModule} from "../ledgers/ledgers.module";

@Module({
    providers: [SecretsService],
    imports: [ServicesModule, UsersModule, TodosModule, AccountsModule, LedgersModule],
    exports: [SecretsService],
})
export class SecretsModule{}
