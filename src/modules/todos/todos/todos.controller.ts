import {Controller, UseGuards} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {TodosService} from "./todos.service";
import {MaintenanceGuard} from "../../misc/maintenance/guards/maintenance.guard";

@Controller("todos")
@ApiTags("Todos")
@UseGuards(MaintenanceGuard)
export class TodosController{
    constructor(
        private readonly todosService: TodosService
    ){}

    // @Get()
    // @UseGuards(AtGuard)
    // @ApiBearerAuth()
    // @ApiResponse({status: HttpStatus.OK, description: "Get all todos", type: TodoEntity, isArray: true})
    // @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    // async getTodos(@Req() req: any): Promise<TodoEntity[]>{
    //     return this.todosService.getTodos(req.user);
    // }
    //
    // @Post()
    // @UseGuards(AtGuard)
    // @ApiBearerAuth()
    // @ApiResponse({status: HttpStatus.CREATED, description: "Create a todo", type: TodoEntity})
    // @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    // async createTodo(@Req() req: any, @Body() createTodoDto: CreateTodoDto): Promise<TodoEntity>{
    //     return await this.todosService.createTodo(
    //         req.user,
    //         createTodoDto.name,
    //         createTodoDto.deadline,
    //         createTodoDto.parent_id,
    //         createTodoDto.frequency,
    //         createTodoDto.icon,
    //         createTodoDto.color
    //     );
    // }
    //
    // @Patch(":id/parent")
    // @UseGuards(AtGuard)
    // @ApiBearerAuth()
    // @ApiResponse({status: HttpStatus.OK, description: "Set todo parent", type: TodoEntity})
    // @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    // @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo not found"})
    // async setTodoParent(@Req() req: any, @Param() todoIdDto: IdDto, @Body() updateParentDto: UpdateParentDto): Promise<TodoEntity>{
    //     return await this.todosService.setTodoParent(req.user, todoIdDto.id, updateParentDto.parent_id);
    // }
    //
    // @Patch(":id/completed")
    // @UseGuards(AtGuard)
    // @ApiBearerAuth()
    // @ApiResponse({status: HttpStatus.OK, description: "Set todo completed", type: TodoEntity})
    // @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    // @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo not found"})
    // async setTodoCompleted(@Req() req: any, @Param() todoIdDto: IdDto, @Body() updateCompletedDto: UpdateCompletedDto): Promise<void>{
    //     await this.todosService.setTodoCompleted(req.user, todoIdDto.id, updateCompletedDto.completed);
    // }
    //
    // @Put(":id")
    // @UseGuards(AtGuard)
    // @ApiBearerAuth()
    // @ApiResponse({status: HttpStatus.OK, description: "Update a todo", type: TodoEntity})
    // @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    // @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo not found"})
    // async updateTodo(@Req() req: any, @Param() todoIdDto: IdDto, @Body() updateTodoDto: UpdateTodoDto): Promise<TodoEntity>{
    //     return await this.todosService.updateTodo(
    //         req.user,
    //         todoIdDto.id,
    //         updateTodoDto.name,
    //         updateTodoDto.deadline,
    //         updateTodoDto.parent_id,
    //         updateTodoDto.frequency,
    //         updateTodoDto.icon,
    //         updateTodoDto.color,
    //         updateTodoDto.completed
    //     );
    // }
    //
    // @Delete(":id")
    // @UseGuards(AtGuard)
    // @ApiBearerAuth()
    // @ApiResponse({status: HttpStatus.OK, description: "Delete a todo"})
    // @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    // @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo not found"})
    // async deleteTodo(@Req() req: any, @Param() deleteTodoDto: DeleteTodoParamDto): Promise<void>{
    //     await this.todosService.deleteTodo(req.user, deleteTodoDto.id, deleteTodoDto.children);
    // }
    //
    // @Delete("/purge")
    // @UseGuards(AtGuard)
    // @ApiBearerAuth()
    // @ApiResponse({status: HttpStatus.OK, description: "Delete all completed todos"})
    // @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    // @ApiResponse({status: HttpStatus.PRECONDITION_FAILED, description: "Cannot purge todos because a child is not completed"})
    // async deleteCompletedTodos(@Req() req: any): Promise<void>{
    //     await this.todosService.purgeTodos(req.user);
    // }
}
