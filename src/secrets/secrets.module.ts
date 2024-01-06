import {Module} from "@nestjs/common";
import {SecretsService} from "./secrets.service";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {TodosModule} from "../todos/todos.module";

@Module({
    providers: [SecretsService],
    imports: [ServicesModule, UsersModule, TodosModule],
    exports: [SecretsService],
})
export class SecretsModule{}
