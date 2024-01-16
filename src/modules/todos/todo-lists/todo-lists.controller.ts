import {Controller} from "@nestjs/common";
import {TodoListsService} from "./todo-lists.service";

@Controller("todo-lists")
export class TodoListsController{
    constructor(private readonly todoListsService: TodoListsService){}
}
