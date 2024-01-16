import {Injectable, NotFoundException} from "@nestjs/common";
import {EncryptionService} from "../../../common/services/encryption.service";
import {TodoListEntity} from "./models/entities/todolist.entity";
import {PrismaService} from "../../../common/services/prisma.service";
import {UserEntity} from "../../security/users/models/entities/user.entity";
import {TodoListResponse} from "./models/responses/todolist.response";
import {TodoEntity} from "../todos/models/entities/todo.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TodoListsService{

    private readonly todoListsEncryptionStrength = parseInt(this.configService.get("TODO_LISTS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
    ){}

    async isTodoListExists(user: UserEntity, todolistId: number): Promise<boolean>{
        return !!await this.prismaService.todoLists.findFirst({
            where: {
                id: todolistId,
                user_id: user.id
            }
        });
    }

    async decryptTodoList(user: UserEntity, todoList: TodoListEntity){
        todoList.name = this.encryptionService.decryptSymmetric(todoList.name, user.secret, this.todoListsEncryptionStrength);
    }

    async getTodoListInfo(user: UserEntity, todolist: TodoListEntity): Promise<TodoListResponse>{
        const todos: TodoEntity[] = await this.prismaService.todos.findMany({
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
        const todoLists = await this.prismaService.todoLists.findMany({
            where: {
                user_id: user.id
            }
        });
        for(const todoList of todoLists)
            await this.decryptTodoList(user, todoList);
        const todoListResponses: TodoListResponse[] = [];
        for(const todoList of todoLists)
            todoListResponses.push(await this.getTodoListInfo(user, todoList));
        return todoListResponses;
    }

    async createTodoList(user: UserEntity, name: string, color: string, icon: string): Promise<TodoListResponse>{
        const encryptedName = this.encryptionService.encryptSymmetric(name, user.secret, this.todoListsEncryptionStrength);
        const todoList: TodoListEntity = await this.prismaService.todoLists.create({
            data: {
                user_id: user.id,
                name: encryptedName,
                color,
                icon
            }
        });
        todoList.name = name;
        return await this.getTodoListInfo(user, todoList);
    }

    async updateTodoList(user: UserEntity, todolistId: number, name: string, color: string, icon: string): Promise<TodoListResponse>{
        if(!await this.isTodoListExists(user, todolistId))
            throw new NotFoundException("Todo list not found");
        const encryptedName = this.encryptionService.encryptSymmetric(name, user.secret, this.todoListsEncryptionStrength);
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
        return await this.getTodoListInfo(user, todoList);
    }

    async deleteTodoList(user: UserEntity, todolistId: number){
        if(!await this.isTodoListExists(user, todolistId))
            throw new NotFoundException("Todo list not found");
        await this.prismaService.todoLists.delete({
            where: {
                id: todolistId
            }
        });
    }

    async completeTodoList(user: UserEntity, todolistId: number){
        if(!await this.isTodoListExists(user, todolistId))
            throw new NotFoundException("Todo list not found");
        await this.prismaService.todos.updateMany({
            where: {
                todo_list_id: todolistId
            },
            data: {
                completed: true
            }
        });
    }

    async rotateEncryptionKey(user: UserEntity, oldSecret: string, newSecret: string){
        const todoLists: TodoListEntity[] = await this.prismaService.todoLists.findMany({
            where: {
                user_id: user.id
            }
        });
        for(const todoList of todoLists){
            const decryptedName = this.encryptionService.decryptSymmetric(todoList.name, oldSecret, this.todoListsEncryptionStrength);
            const encryptedName = this.encryptionService.encryptSymmetric(decryptedName, newSecret, this.todoListsEncryptionStrength);
            await this.prismaService.todoLists.update({
                where: {
                    id: todoList.id
                },
                data: {
                    name: encryptedName
                }
            });
        }
    }
}
