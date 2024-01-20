import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {EncryptionService} from "../../../common/services/encryption.service";
import {ConfigService} from "@nestjs/config";
import {TodoCacheService} from "../../cache/todo-cache.service";
import {UserEntity} from "../../security/users/models/entities/user.entity";
import {TodoEntity} from "./models/entities/todo.entity";
import {TodoListsService} from "../todo-lists/todo-lists.service";
import {TodoListCacheService} from "../../cache/todo-list-cache.service";
import {TodoListEntity} from "../todo-lists/models/entities/todolist.entity";
import {Prisma} from "@prisma/client/extension";

@Injectable()
export class TodosService{

    private readonly todosEncryptionStrength = parseInt(this.configService.get("TODOS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
        private readonly todoCacheService: TodoCacheService,
        private readonly todoListsService: TodoListsService,
        private readonly todoListCacheService: TodoListCacheService,
    ){}

    decryptTodo(user: UserEntity, todo: TodoEntity){
        todo.name = this.encryptionService.decryptSymmetric(todo.name, user.secret, this.todosEncryptionStrength);
        return todo;
    }

    async getTodoListFromTodo(user: UserEntity, todoId: number): Promise<TodoListEntity>{
        const todo = await this.prismaService.todos.findUnique({
            where: {
                id: todoId,
            },
            include: {
                todo_list: true,
            }
        });
        if(!todo)
            throw new NotFoundException("Todo not found");
        return todo.todo_list;
    }

    async isTodoExists(user: UserEntity, id: number){
        return !!await this.prismaService.todos.findUnique({
            where: {
                id: id,
                todo_list: {
                    user_id: user.id,
                }
            }
        });
    }

    async getTodos(user: UserEntity, todoListId: number){
        const cachedTodos = await this.todoCacheService.getTodos(user.id, todoListId);
        if(cachedTodos)
            return cachedTodos;
        if(!await this.todoListsService.isTodoListExists(user, todoListId))
            throw new NotFoundException("Todo list not found");
        const todos: TodoEntity[] = await this.prismaService.todos.findMany({
            where: {
                todo_list_id: todoListId,
            }
        });
        const decryptedTodos = await Promise.all(todos.map(todo => this.decryptTodo(user, todo)));
        await this.todoCacheService.setTodos(user.id, todoListId, decryptedTodos);
        return decryptedTodos;
    }

    async createTodo(user: UserEntity, name: string, todoListId: number, deadline: Date){
        if(!await this.todoListsService.isTodoListExists(user, todoListId))
            throw new NotFoundException("Todo list not found");
        const encryptedName = this.encryptionService.encryptSymmetric(name, user.secret, this.todosEncryptionStrength);
        const todo: TodoEntity = await this.prismaService.todos.create({
            data: {
                name: encryptedName,
                todo_list_id: todoListId,
                deadline: deadline,
            }
        });
        todo.name = name;
        await this.todoListCacheService.todoAdded(user, todoListId);
        await this.todoCacheService.addTodo(user.id, todo);
        return todo;
    }

    async updateTodo(user: UserEntity, id: number, name: string, deadline: Date, completed: boolean){
        if(!await this.isTodoExists(user, id))
            throw new NotFoundException("Todo not found");
        const encryptedName = this.encryptionService.encryptSymmetric(name, user.secret, this.todosEncryptionStrength);
        const todo: TodoEntity = await this.prismaService.todos.update({
            where: {
                id: id,
            },
            data: {
                name: encryptedName,
                deadline: deadline,
                completed: completed,
            }
        });
        todo.name = name;
        await this.todoListCacheService.todoCompleted(user, todo.todo_list_id, completed);
        await this.todoCacheService.updateTodo(user.id, todo);
        return todo;
    }

    async completeTodo(user: UserEntity, id: number, completed: boolean): Promise<void>{
        if(!await this.isTodoExists(user, id))
            throw new NotFoundException("Todo not found");
        await this.prismaService.todos.update({
            where: {
                id: id,
            },
            data: {
                completed: completed,
            }
        });
        const todoList = await this.getTodoListFromTodo(user, id);
        await this.todoListCacheService.todoCompleted(user, todoList.id, completed);
        await this.todoCacheService.completeTodo(user.id, id, completed);
    }

    async deleteTodo(user: UserEntity, id: number){
        if(!await this.isTodoExists(user, id))
            throw new NotFoundException("Todo not found");
        const todoList = await this.getTodoListFromTodo(user, id);
        await this.todoListCacheService.todoRemoved(user, todoList.id);
        await this.prismaService.todos.delete({
            where: {
                id: id,
            }
        });
        await this.todoCacheService.removeTodo(user.id, id);
    }

    async rotateEncryptionKey(tx: Prisma.TransactionClient, user: UserEntity, oldKey: string, newKey: string){
        const todos: TodoEntity[] = await tx.todos.findMany({
            where: {
                todo_list: {
                    user_id: user.id,
                }
            }
        });
        for(const todo of todos){
            todo.name = this.encryptionService.decryptSymmetric(todo.name, oldKey, this.todosEncryptionStrength);
            todo.name = this.encryptionService.encryptSymmetric(todo.name, newKey, this.todosEncryptionStrength);
            await tx.todos.update({
                where: {
                    id: todo.id,
                },
                data: {
                    name: todo.name,
                }
            });
        }
    }
}
