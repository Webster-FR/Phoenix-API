import {Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../common/services/prisma.service";
import {TodoEntity} from "./models/entities/todo.entity";
import {UsersService} from "../../users/users.service";
import {EncryptionService} from "../../common/services/encryption.service";
import {ConfigService} from "@nestjs/config";
import {UserEntity} from "../../users/models/entities/user.entity";

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
        if(parentId !== undefined){
            const parentTodo = await this.findTodoById(user, parentId);
            if(parentTodo.parent_id !== null)
                throw new InternalServerErrorException("Todo cannot have a parent that has a parent");
        }
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
        const parentTodo = await this.findTodoById(user, parentId);
        if(parentTodo.parent_id !== null)
            throw new InternalServerErrorException("Todo cannot have a parent that has a parent");
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

    async setTodoCompleted(user: UserEntity, todoId: number, completed: boolean): Promise<void>{
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
    }

    async updateTodo(user: UserEntity, todoId: number, name: string, deadline: Date, parentId: number, frequency: string, icon: string, color: string, completed: boolean): Promise<TodoEntity>{
        if(parentId !== undefined){
            const parentTodo = await this.findTodoById(user, parentId);
            if(parentTodo.parent_id !== null)
                throw new InternalServerErrorException("Todo cannot have a parent that has a parent");
        }
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
                parent_id: parentId
            },
        });
        if(!todo)
            throw new NotFoundException("Todo not found");
        return this.decryptTodo(user, todo);
    }

    async deleteTodo(user: UserEntity, todoId: number, children: boolean): Promise<void>{
        if(children)
            await this.deleteTodoChildren(user, todoId);
        const todo: TodoEntity = await this.prismaService.todos.delete({
            where: {
                id: todoId
            },
        });
        if(!todo)
            throw new NotFoundException("Todo not found");
    }

    async deleteTodoChildren(user: UserEntity, todoId: number): Promise<void>{
        console.log("Deleting children of todo " + todoId);
        await this.prismaService.todos.deleteMany({
            where: {
                parent_id: todoId
            },
        });
    }

    async deleteCompletedTodos(user: UserEntity){
        await this.prismaService.todos.deleteMany({
            where: {
                user_id: user.id,
                completed: true
            }
        });
    }
}