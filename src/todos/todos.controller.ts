import {Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Req, UseGuards} from "@nestjs/common";
import {TodosService} from "./todos.service";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AtGuard} from "../auth/guards/at.guard";
import {TodoEntity} from "./models/entities/todo.entity";
import {CreateTodoDto} from "./models/dto/create-todo.dto";
import {UpdateParentDto} from "./models/dto/update-parent.dto";
import {UpdateCompletedDto} from "./models/dto/update-completed.dto";
import {UpdateTodoDto} from "./models/dto/update-todo.dto";
import {TodoIdDto} from "./models/dto/todo-id.dto";

@Controller("todos")
@ApiTags("Todos")
export class TodosController{
    constructor(
        private readonly todosService: TodosService
    ){}

    @Get()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Get all todos", type: TodoEntity, isArray: true})
    async getTodos(@Req() req: any): Promise<TodoEntity[]>{
        return this.todosService.getTodos(req.user.id);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, description: "Create a todo", type: TodoEntity})
    async createTodo(@Req() req: any, @Body() createTodoDto: CreateTodoDto): Promise<TodoEntity>{
        return await this.todosService.createTodo(
            req.user.id,
            createTodoDto.name,
            createTodoDto.deadline,
            createTodoDto.parent_id,
            createTodoDto.frequency,
            createTodoDto.icon,
            createTodoDto.color
        );
    }

    @Patch(":id/parent")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Set todo parent", type: TodoEntity})
    async setTodoParent(@Req() req: any, @Param() todoIdDto: TodoIdDto, @Body() updateParentDto: UpdateParentDto): Promise<TodoEntity>{
        return await this.todosService.setTodoParent(req.user.id, todoIdDto.id, updateParentDto.parent_id);
    }

    @Patch(":id/completed")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Set todo completed", type: TodoEntity})
    async setTodoCompleted(@Req() req: any, @Param() todoIdDto: TodoIdDto, @Body() updateCompletedDto: UpdateCompletedDto): Promise<TodoEntity>{
        return await this.todosService.setTodoCompleted(req.user.id, todoIdDto.id, updateCompletedDto.completed);
    }

    @Put(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Update a todo", type: TodoEntity})
    async updateTodo(@Req() req: any, @Param() todoIdDto: TodoIdDto, @Body() updateTodoDto: UpdateTodoDto): Promise<TodoEntity>{
        return await this.todosService.updateTodo(
            req.user.id,
            todoIdDto.id,
            updateTodoDto.name,
            updateTodoDto.deadline,
            updateTodoDto.frequency,
            updateTodoDto.icon,
            updateTodoDto.color,
            updateTodoDto.completed
        );
    }

    @Delete(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Delete a todo", type: TodoEntity})
    async deleteTodo(@Req() req: any, @Param() todoIdDto: TodoIdDto): Promise<TodoEntity>{
        return await this.todosService.deleteTodo(req.user.id, todoIdDto.id);
    }
}
