import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {TodosService} from "./todos.service";
import {MaintenanceGuard} from "../../misc/maintenance/guards/maintenance.guard";
import {AtGuard} from "../../security/auth/guards/at.guard";
import {TodoListIdDto} from "./models/dto/todo-list-id.dto";
import {CreateTodoDto} from "./models/dto/create-todo.dto";
import {IdDto} from "../../../common/models/dto/id.dto";
import {UpdateCompletedDto} from "./models/dto/update-completed.dto";
import {UpdateTodoDto} from "./models/dto/update-todo.dto";

@Controller("todos")
@ApiTags("Todos")
@UseGuards(MaintenanceGuard)
export class TodosController{

    constructor(
        private readonly todosService: TodosService
    ){}

    @Get(":todo_list_id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async getTodos(@Req() req: any, @Param() todoListIdDto: TodoListIdDto){
        return this.todosService.getTodos(req.user, todoListIdDto.todo_list_id);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async createTodo(@Req() req: any, @Body() createTodoDto: CreateTodoDto){
        return this.todosService.createTodo(req.user, createTodoDto.name, createTodoDto.todo_list_id, createTodoDto.deadline);
    }

    @Put(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async updateTodoStatus(@Req() req: any, @Param() idDto: IdDto, @Body() updateTodoDto: UpdateTodoDto){
        return this.todosService.updateTodo(req.user, idDto.id, updateTodoDto.name, updateTodoDto.deadline, updateTodoDto.completed);
    }

    @Patch("/complete/:id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async completeTodoStatus(@Req() req: any, @Param() idDto: IdDto, @Body() updateCompletedDto: UpdateCompletedDto){
        return this.todosService.completeTodo(req.user, idDto.id, updateCompletedDto.completed);
    }

    @Delete(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async deleteTodoStatus(@Req() req: any, @Param() idDto: IdDto){
        return this.todosService.deleteTodo(req.user, idDto.id);
    }

}
