import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {TodoEntity} from "./models/entities/todo.entity";

@Injectable()
export class TodosService{

    constructor(
        private readonly prismService: PrismaService,
    ){}

    async isTodoExists(userId: number, todoId: number): Promise<boolean>{
        const todo: TodoEntity = await this.prismService.todos.findUnique({where: {id: todoId, user_id: userId}});
        return todo !== null;
    }

    async getTodos(userId: number): Promise<TodoEntity[]>{
        return this.prismService.todos.findMany({where: {user_id: userId}});
    }

    async createTodo(userId: number, name: string, deadline: Date, parentId: number, frequency: string, icon: string, color: string): Promise<TodoEntity>{
        if(parentId !== undefined && !await this.isTodoExists(userId, parentId))
            throw new NotFoundException(`Todo with id ${parentId} not found`);
        return this.prismService.todos.create({
            data: {
                user_id: userId,
                name: name,
                deadline: deadline,
                parent_id: parentId,
                frequency: frequency,
                icon: icon,
                color: color,
            },
        });
    }

    async setTodoParent(userId: number, todoId: number, parentId: number): Promise<TodoEntity>{
        if(todoId === parentId)
            throw new BadRequestException(`Todo with id ${todoId} cannot be its own parent`);
        if(!await this.isTodoExists(userId, parentId))
            throw new NotFoundException(`Todo with id ${parentId} not found`);
        return this.prismService.todos.update({
            where: {
                id: todoId
            },
            data: {
                parent_id: parentId
            },
        });
    }

    async setTodoCompleted(userId: number, todoId: number, completed: boolean): Promise<TodoEntity>{
        if(!await this.isTodoExists(userId, todoId))
            throw new NotFoundException(`Todo with id ${todoId} not found`);
        return this.prismService.todos.update({
            where: {
                id: todoId,
                user_id: userId
            },
            data: {
                completed: completed
            },
        });
    }

    async updateTodo(userId: number, todoId: number, name: string, deadline: Date, frequency: string, icon: string, color: string, completed: boolean): Promise<TodoEntity>{
        if(!await this.isTodoExists(userId, todoId))
            throw new NotFoundException(`Todo with id ${todoId} not found`);
        return this.prismService.todos.update({
            where: {
                id: todoId
            },
            data: {
                name: name,
                deadline: deadline,
                frequency: frequency,
                icon: icon,
                color: color,
                completed: completed,
            },
        });
    }

    async deleteTodo(userId: number, todoId: number): Promise<TodoEntity>{
        if(!await this.isTodoExists(userId, todoId))
            throw new NotFoundException(`Todo with id ${todoId} not found`);
        return this.prismService.todos.delete({
            where: {
                id: todoId
            },
        });
    }
}
