import {Module} from "@nestjs/common";
import {TodoListsService} from "./todo-lists.service";
import {TodoListsController} from "./todo-lists.controller";

@Module({
    controllers: [TodoListsController],
    providers: [TodoListsService],
})
export class TodoListsModule{}
