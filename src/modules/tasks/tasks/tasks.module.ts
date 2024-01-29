import {Module} from "@nestjs/common";
import {TasksService} from "./tasks.service";
import {TasksController} from "./tasks.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../../security/users/users.module";
import {AuthModule} from "../../security/auth/auth.module";
import {CacheModule} from "../../cache/cache.module";
import {TodoListsModule} from "../todolists/todo-lists.module";

@Module({
    controllers: [TasksController],
    providers: [TasksService],
    imports: [ServicesModule, UsersModule, AuthModule, CacheModule, TodoListsModule],
    exports: [TasksService],
})
export class TasksModule{}
