import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {TodoEntity} from "./models/entities/todo.entity";
import {UsersService} from "../users/users.service";
import {EncryptionService} from "../services/encryption.service";
import {ConfigService} from "@nestjs/config";
import {UserEntity} from "../users/models/entities/user.entity";

@Injectable()
export class TodosService{

    private readonly todosEncryptionStrength = parseInt(this.configService.get("TODOS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
    ){}

    decryptTodo(user: UserEntity, todo: TodoEntity): TodoEntity{
        todo.name = this.encryptionService.decryptSymmetric(todo.name, user.secret, this.todosEncryptionStrength);
        return todo;
    }

    async isTodoExists(user: UserEntity, todoId: number): Promise<boolean>{
        return !!await this.prismaService.todos.findUnique({where: {id: todoId, user_id: user.id}});
    }

    async getTodos(user: UserEntity): Promise<TodoEntity[]>{
        if(!user)
            throw new NotFoundException("User not found");
        const todos: TodoEntity[] = await this.prismaService.todos.findMany({where: {user_id: user.id}});
        const decryptedTodos: TodoEntity[] = [];
        for(const todo of todos)
            decryptedTodos.push(this.decryptTodo(user, todo));
        return decryptedTodos;
    }

    async findTodoById(user: UserEntity, todoId: number): Promise<TodoEntity>{
        const todo: TodoEntity = await this.prismaService.todos.findUnique({
            where: {
                id: todoId,
                user_id: user.id
            }
        });
        if(!todo)
            throw new NotFoundException("Todo not found");
        return this.decryptTodo(user, todo);
    }

    async createTodo(user: UserEntity, name: string, deadline: Date, parentId: number, frequency: string, icon: string, color: string): Promise<TodoEntity>{
        if(parentId !== undefined && !await this.isTodoExists(user, parentId))
            throw new NotFoundException("Parent todo not found");
        const todoName = this.encryptionService.encryptSymmetric(name, user.secret, this.todosEncryptionStrength);
        const todo: TodoEntity = await this.prismaService.todos.create({
            data: {
                user_id: user.id,
                name: todoName,
                deadline: deadline,
                parent_id: parentId,
                frequency: frequency,
                icon: icon,
                color: color,
            },
        });
        todo.name = name;
        return todo;
    }

    async setTodoParent(user: UserEntity, todoId: number, parentId: number): Promise<TodoEntity>{
        const todo = await this.prismaService.todos.update({
            where: {
                id: todoId,
                user_id: user.id
            },
            data: {
                parent_id: parentId
            },
        });
        if(!todo)
            throw new NotFoundException("Todo not found");
        return this.decryptTodo(user, todo);
    }

    async setTodoCompleted(user: UserEntity, todoId: number, completed: boolean): Promise<TodoEntity>{
        const todo: TodoEntity = await this.prismaService.todos.update({
            where: {
                id: todoId,
                user_id: user.id
            },
            data: {
                completed: completed
            },
        });
        if(!todo)
            throw new NotFoundException("Todo not found");
        return this.decryptTodo(user, todo);
    }

    async updateTodo(user: UserEntity, todoId: number, name: string, deadline: Date, frequency: string, icon: string, color: string, completed: boolean): Promise<TodoEntity>{
        const todoName = this.encryptionService.encryptSymmetric(name, user.secret, this.todosEncryptionStrength);
        const todo: TodoEntity = await this.prismaService.todos.update({
            where: {
                id: todoId,
                user_id: user.id
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
        if(!todo)
            throw new NotFoundException("Todo not found");
        return this.decryptTodo(user, todo);
    }

    async deleteTodo(user: UserEntity, todoId: number): Promise<TodoEntity>{
        const todo = await this.prismaService.todos.delete({
            where: {
                id: todoId
            },
        });
        if(!todo)
            throw new NotFoundException("Todo not found");
        return this.decryptTodo(user, todo);
    }
}
