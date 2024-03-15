import {Module} from "@nestjs/common";
import {SecretsService} from "./secrets.service";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../users/users.module";
import {TasksModule} from "../../tasks/tasks/tasks.module";
import {TodoListsModule} from "../../tasks/todolists/todo-lists.module";

@Module({
    providers: [SecretsService],
    exports: [SecretsService],
    imports: [ServicesModule, UsersModule, TasksModule, TodoListsModule],
})
export class SecretsModule{}
