import {Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Req, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TasksService} from "./tasks.service";
import {AtGuard} from "../../security/auth/guards/at.guard";
import {TodoListIdDto} from "./models/dto/todo-list-id.dto";
import {CreateTodoDto} from "./models/dto/create-todo.dto";
import {IdDto} from "../../../common/models/dto/id.dto";
import {UpdateCompletedDto} from "./models/dto/update-completed.dto";
import {UpdateTodoDto} from "./models/dto/update-todo.dto";
import {TaskEntity} from "./models/entities/task.entity";

@Controller("todos")
@ApiTags("Todos")
export class TasksController{

    constructor(
        private readonly todosService: TasksService
    ){}

    @Get(":todo_list_id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Get todos", type: TaskEntity, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo list not found"})
    async getTodos(@Req() req: any, @Param() todoListIdDto: TodoListIdDto){
        return this.todosService.getTasks(req.user, todoListIdDto.todo_list_id);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, description: "Todo created", type: TaskEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo list not found"})
    async createTodo(@Req() req: any, @Body() createTodoDto: CreateTodoDto){
        return this.todosService.createTask(req.user, createTodoDto.name, createTodoDto.todo_list_id, createTodoDto.deadline);
    }

    @Put(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Todo updated"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo not found"})
    async updateTodoStatus(@Req() req: any, @Param() idDto: IdDto, @Body() updateTodoDto: UpdateTodoDto){
        return this.todosService.updateTask(req.user, idDto.id, updateTodoDto.name, updateTodoDto.deadline, updateTodoDto.completed);
    }

    @Patch("/complete/:id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Todo completed"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo not found"})
    async completeTodoStatus(@Req() req: any, @Param() idDto: IdDto, @Body() updateCompletedDto: UpdateCompletedDto){
        return this.todosService.completeTask(req.user, idDto.id, updateCompletedDto.completed);
    }

    @Delete(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Todo deleted"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo not found"})
    async deleteTodoStatus(@Req() req: any, @Param() idDto: IdDto){
        return this.todosService.deleteTask(req.user, idDto.id);
    }

}
