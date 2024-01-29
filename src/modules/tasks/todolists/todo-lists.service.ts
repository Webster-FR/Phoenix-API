// noinspection TypeScriptValidateJSTypes

import {Injectable, NotFoundException} from "@nestjs/common";
import {CipherService} from "../../../common/services/cipher.service";
import {TodoListEntity} from "./models/entities/todolist.entity";
import {PrismaService} from "../../../common/services/prisma.service";
import {UserEntity} from "../../security/users/models/entities/user.entity";
import {TodoListResponse} from "./models/responses/todolist.response";
import {TaskEntity} from "../tasks/models/entities/task.entity";
import {ConfigService} from "@nestjs/config";
import {TodoListCacheService} from "../../cache/todo-list-cache.service";
import {TodoCacheService} from "../../cache/todo-cache.service";
import {Prisma} from "@prisma/client/extension";

@Injectable()
export class TodoListsService{

    private readonly todoListsEncryptionStrength = parseInt(this.configService.get("TODO_LISTS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: CipherService,
        private readonly configService: ConfigService,
        private readonly todoListsCache: TodoListCacheService,
        private readonly todoCacheService: TodoCacheService,
    ){}

    async isTodoListExists(user: UserEntity, todolistId: number): Promise<boolean>{
        return await this.todoListsCache.isTodoListExists(user, todolistId) || !!await this.prismaService.todoLists.findFirst({
            where: {
                id: todolistId,
                user_id: user.id
            }
        });
    }

    async decryptTodoList(user: UserEntity, todoList: TodoListEntity){
        todoList.name = this.encryptionService.decipherSymmetric(todoList.name, user.secret, this.todoListsEncryptionStrength);
    }

    async getTodoListInfo(user: UserEntity, todolist: TodoListEntity): Promise<TodoListResponse>{
        const todos: TaskEntity[] = await this.prismaService.tasks.findMany({
            where: {
                todo_list_id: todolist.id
            }
        });
        const completedCount = todos.filter(todo => todo.completed).length;
        const todosCount = todos.length;
        return {
            ...todolist,
            todo_count: todosCount,
            completed_todo_count: completedCount
        };
    }

    async getTodoLists(user: UserEntity): Promise<TodoListResponse[]>{
        const cachedTodoLists = await this.todoListsCache.getTodoLists(user);
        if(cachedTodoLists)
            return cachedTodoLists;
        const todoLists = await this.prismaService.todoLists.findMany({
            where: {
                user_id: user.id
            },
            orderBy: {
                id: "asc"
            }
        });
        await Promise.all(todoLists.map(todoList => this.decryptTodoList(user, todoList)));
        const todoListResponses = await Promise.all(todoLists.map(todoList => this.getTodoListInfo(user, todoList)));
        await this.todoListsCache.setTodoLists(user, todoListResponses);
        return todoListResponses;
    }

    async createTodoList(user: UserEntity, name: string, color: string, icon: string): Promise<TodoListResponse>{
        const encryptedName = this.encryptionService.cipherSymmetric(name, user.secret, this.todoListsEncryptionStrength);
        const todoList: TodoListEntity = await this.prismaService.todoLists.create({
            data: {
                user_id: user.id,
                name: encryptedName,
                color,
                icon
            }
        });
        todoList.name = name;
        const todoListWithInfo = await this.getTodoListInfo(user, todoList);
        await this.todoListsCache.addTodoList(user, todoListWithInfo);
        return todoListWithInfo;
    }

    async updateTodoList(user: UserEntity, todolistId: number, name: string, color: string, icon: string): Promise<TodoListResponse>{
        if(!await this.isTodoListExists(user, todolistId))
            throw new NotFoundException("Todo list not found");
        const encryptedName = this.encryptionService.cipherSymmetric(name, user.secret, this.todoListsEncryptionStrength);
        const todoList: TodoListEntity = await this.prismaService.todoLists.update({
            where: {
                id: todolistId
            },
            data: {
                name: encryptedName,
                color,
                icon
            }
        });
        todoList.name = name;
        const todoListWithInfo = await this.getTodoListInfo(user, todoList);
        await this.todoListsCache.updateTodoList(user, todoListWithInfo);
        return todoListWithInfo;
    }

    async deleteTodoList(user: UserEntity, todolistId: number){
        if(!await this.isTodoListExists(user, todolistId))
            throw new NotFoundException("Todo list not found");
        await this.prismaService.todoLists.delete({
            where: {
                id: todolistId
            }
        });
        await this.todoListsCache.deleteTodoList(user, todolistId);
    }

    async completeTodoList(user: UserEntity, todolistId: number){
        if(!await this.isTodoListExists(user, todolistId))
            throw new NotFoundException("Todo list not found");
        const {count} = await this.prismaService.tasks.updateMany({
            where: {
                todo_list_id: todolistId
            },
            data: {
                completed: true
            }
        });
        await this.todoListsCache.completeTodoList(user, todolistId, count);
        await this.todoCacheService.completeAll(user.id, todolistId);
    }

    async rotateEncryptionKey(tx: Prisma.TransactionClient, user: UserEntity, oldSecret: string, newSecret: string){
        const todoLists: TodoListEntity[] = await this.prismaService.todoLists.findMany({
            where: {
                user_id: user.id
            }
        });

        const data = [];
        for(const todoList of todoLists){
            const decryptedName = this.encryptionService.decipherSymmetric(todoList.name, oldSecret, this.todoListsEncryptionStrength);
            const encryptedName = this.encryptionService.cipherSymmetric(decryptedName, newSecret, this.todoListsEncryptionStrength);
            data.push({
                where: {
                    id: todoList.id
                },
                data: {
                    name: encryptedName
                }
            });
        }
        const promises = [];
        for(const todoList of todoLists)
            promises.push(this.rotateTodoList(tx, todoList, oldSecret, newSecret));
        await Promise.all(promises);
    }

    private async rotateTodoList(tx: Prisma.TransactionClient, todoList: TodoListEntity, oldSecret: string, newSecret: string){
        const decryptedName = this.encryptionService.decipherSymmetric(todoList.name, oldSecret, this.todoListsEncryptionStrength);
        const encryptedName = this.encryptionService.cipherSymmetric(decryptedName, newSecret, this.todoListsEncryptionStrength);
        await tx.todoLists.update({
            where: {
                id: todoList.id
            },
            data: {
                name: encryptedName
            }
        });
    }
}
