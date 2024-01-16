import {Module} from "@nestjs/common";
import {TodoListsService} from "./todo-lists.service";
import {TodoListsController} from "./todo-lists.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../../security/users/users.module";
import {AuthModule} from "../../security/auth/auth.module";

@Module({
    controllers: [TodoListsController],
    providers: [TodoListsService],
    imports: [ServicesModule, UsersModule, AuthModule],
})
export class TodoListsModule{}
