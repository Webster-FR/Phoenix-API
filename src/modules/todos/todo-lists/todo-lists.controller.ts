import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, UseGuards} from "@nestjs/common";
import {TodoListsService} from "./todo-lists.service";
import {AtGuard} from "../../security/auth/guards/at.guard";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {MaintenanceGuard} from "../../misc/maintenance/guards/maintenance.guard";
import {IdDto} from "../../../common/models/dto/id.dto";
import {TodolistDto} from "./models/dto/todolist.dto";
import {TodoListResponse} from "./models/responses/todolist.response";

@Controller("todolists")
@ApiTags("Todo Lists")
@UseGuards(MaintenanceGuard)
export class TodoListsController{

    constructor(
        private readonly todoListsService: TodoListsService
    ){}

    @Get()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, type: TodoListResponse, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    async getTodoLists(@Req() req: any): Promise<TodoListResponse[]>{
        return await this.todoListsService.getTodoLists(req.user);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, type: TodoListResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    async createTodoList(@Req() req: any, @Body() todolistDto: TodolistDto){
        return await this.todoListsService.createTodoList(req.user, todolistDto.name, todolistDto.color, todolistDto.icon);
    }

    @Put(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, type: TodoListResponse})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo list not found"})
    async updateTodoList(@Req() req: any, @Param() idDto: IdDto, @Body() todolistDto: TodolistDto){
        return await this.todoListsService.updateTodoList(req.user, idDto.id, todolistDto.name, todolistDto.color, todolistDto.icon);
    }

    @Delete(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Todo list deleted"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo list not found"})
    async deleteTodoList(@Req() req: any, @Param() idDto: IdDto){
        return await this.todoListsService.deleteTodoList(req.user, idDto.id);
    }

    @Post("complete")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Todo list completed"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "Todo list not found"})
    async completeTodoList(@Req() req: any, @Param() idDto: IdDto){
        return await this.todoListsService.completeTodoList(req.user, idDto.id);
    }
}
