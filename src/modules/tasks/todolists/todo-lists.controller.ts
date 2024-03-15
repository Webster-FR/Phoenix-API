import {Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Req} from "@nestjs/common";
import {TodoListsService} from "./todo-lists.service";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {IdDto} from "../../../common/models/dto/id.dto";
import {TodolistDto} from "./models/dto/todolist.dto";
import {TodoListResponse} from "./models/responses/todolist.response";
import {UseAT} from "../../security/auth/decorators/public.decorator";

@Controller("todolists")
@ApiTags("Todo Lists")
export class TodoListsController{

    constructor(
        private readonly todoListsService: TodoListsService
    ){}

    @Get()
    @UseAT()
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, type: TodoListResponse, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    async getTodoLists(@Req() req: any): Promise<TodoListResponse[]>{
        return await this.todoListsService.getTodoLists(req.user);
    }

    @Post()
    @UseAT()
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, type: TodoListResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    async createTodoList(@Req() req: any, @Body() todolistDto: TodolistDto){
        return await this.todoListsService.createTodoList(req.user, todolistDto.name, todolistDto.color, todolistDto.icon);
    }

    @Put(":id")
    @UseAT()
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, type: TodoListResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo list not found"})
    async updateTodoList(@Req() req: any, @Param() idDto: IdDto, @Body() todolistDto: TodolistDto){
        return await this.todoListsService.updateTodoList(req.user, idDto.id, todolistDto.name, todolistDto.color, todolistDto.icon);
    }

    @Delete(":id")
    @UseAT()
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Todo list deleted"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo list not found"})
    async deleteTodoList(@Req() req: any, @Param() idDto: IdDto){
        return await this.todoListsService.deleteTodoList(req.user, idDto.id);
    }

    @Patch("complete/:id")
    @UseAT()
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Todo list completed"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo list not found"})
    async completeTodoList(@Req() req: any, @Param() idDto: IdDto){
        return await this.todoListsService.completeTodoList(req.user, idDto.id);
    }
}
