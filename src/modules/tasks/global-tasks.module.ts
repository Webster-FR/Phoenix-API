import {Module} from "@nestjs/common";
import {TasksModule} from "./tasks/tasks.module";
import {TodoListsModule} from "./todolists/todo-lists.module";

@Module({
    imports: [TasksModule, TodoListsModule],
})
export class GlobalTasksModule{}
