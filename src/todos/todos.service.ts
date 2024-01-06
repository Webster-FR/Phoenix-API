import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {TodoEntity} from "./models/entities/todo.entity";
import {UsersService} from "../users/users.service";
import {EncryptionService} from "../services/encryption.service";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TodosService{

    private readonly todosEncryptionStrength = parseInt(this.configService.get("TODOS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
    ){}

    async isTodoExists(userId: number, todoId: number): Promise<boolean>{
        const todo: TodoEntity = await this.prismaService.todos.findUnique({where: {id: todoId, user_id: userId}});
        return todo !== null;
    }

    async getTodos(userId: number): Promise<TodoEntity[]>{
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        const todos: TodoEntity[] = await this.prismaService.todos.findMany({where: {user_id: userId}});
        for(const todo of todos)
            todo.name = this.encryptionService.decryptSymmetric(todo.name, user.secret, this.todosEncryptionStrength);
        return todos;
    }

    async findTodoById(userId: number, todoId: number): Promise<TodoEntity>{
        if(!await this.isTodoExists(userId, todoId))
            throw new NotFoundException(`Todo with id ${todoId} not found`);
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        const todo: TodoEntity = await this.prismaService.todos.findUnique({where: {id: todoId}});
        todo.name = this.encryptionService.decryptSymmetric(todo.name, user.secret, this.todosEncryptionStrength);
        return todo;
    }

    async createTodo(userId: number, name: string, deadline: Date, parentId: number, frequency: string, icon: string, color: string): Promise<TodoEntity>{
        if(parentId !== undefined && !await this.isTodoExists(userId, parentId))
            throw new NotFoundException(`Todo with id ${parentId} not found`);
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        const todoName = this.encryptionService.encryptSymmetric(name, user.secret, this.todosEncryptionStrength);
        const todo = await this.prismaService.todos.create({
            data: {
                user_id: userId,
                name: todoName,
                deadline: deadline,
                parent_id: parentId,
                frequency: frequency,
                icon: icon,
                color: color,
            },
        });
        return this.findTodoById(userId, todo.id);
    }

    async setTodoParent(userId: number, todoId: number, parentId: number): Promise<TodoEntity>{
        if(todoId === parentId)
            throw new BadRequestException(`Todo with id ${todoId} cannot be its own parent`);
        if(!await this.isTodoExists(userId, parentId))
            throw new NotFoundException(`Todo with id ${parentId} not found`);
        const todo = await this.prismaService.todos.update({
            where: {
                id: todoId
            },
            data: {
                parent_id: parentId
            },
        });
        return this.findTodoById(userId, todo.id);
    }

    async setTodoCompleted(userId: number, todoId: number, completed: boolean): Promise<TodoEntity>{
        if(!await this.isTodoExists(userId, todoId))
            throw new NotFoundException(`Todo with id ${todoId} not found`);
        const todo = await this.prismaService.todos.update({
            where: {
                id: todoId,
                user_id: userId
            },
            data: {
                completed: completed
            },
        });
        return this.findTodoById(userId, todo.id);
    }

    async updateTodo(userId: number, todoId: number, name: string, deadline: Date, frequency: string, icon: string, color: string, completed: boolean): Promise<TodoEntity>{
        if(!await this.isTodoExists(userId, todoId))
            throw new NotFoundException(`Todo with id ${todoId} not found`);
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        const todoName = this.encryptionService.encryptSymmetric(name, user.secret, this.todosEncryptionStrength);
        const todo = await this.prismaService.todos.update({
            where: {
                id: todoId
            },
            data: {
                name: todoName,
                deadline: deadline,
                frequency: frequency,
                icon: icon,
                color: color,
                completed: completed,
            },
        });
        return this.findTodoById(userId, todo.id);
    }

    async deleteTodo(userId: number, todoId: number): Promise<TodoEntity>{
        if(!await this.isTodoExists(userId, todoId))
            throw new NotFoundException(`Todo with id ${todoId} not found`);
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        const todo = await this.prismaService.todos.delete({
            where: {
                id: todoId
            },
        });
        todo.name = this.encryptionService.decryptSymmetric(todo.name, user.secret, this.todosEncryptionStrength);
        return todo;
    }
}
