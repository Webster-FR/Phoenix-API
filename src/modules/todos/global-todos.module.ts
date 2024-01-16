import {Module} from "@nestjs/common";
import {TodosModule} from "./todos/todos.module";
import {TodoListsModule} from "./todo-lists/todo-lists.module";

@Module({
    imports: [TodosModule, TodoListsModule],
})
export class GlobalTodosModule{}
