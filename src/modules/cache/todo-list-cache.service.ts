import {Inject, Injectable, InternalServerErrorException} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {UserEntity} from "../security/users/models/entities/user.entity";
import {TodoListResponse} from "../todos/todo-lists/models/responses/todolist.response";
import {Cache} from "cache-manager";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TodoListCacheService{

    private readonly todoListCacheTtl = parseInt(this.configService.get("TODOLIST_CACHE_TTL"));

    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async setTodoLists(user: UserEntity, todoLists: TodoListResponse[]){
        await this.cacheManager.set(`todos-${user.id}`, todoLists, this.todoListCacheTtl);
    }

    async getTodoLists(user: UserEntity): Promise<TodoListResponse[]>{
        return await this.cacheManager.get<TodoListResponse[]>(`todos-${user.id}`);
    }

    async getTodoList(user: UserEntity, todolistId: number): Promise<TodoListResponse>{
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return null;
        return todoLists.find(todoList => todoList.id === todolistId);
    }

    async isTodoListExists(user: UserEntity, todolistId: number): Promise<boolean>{
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return false;
        return !!todoLists.find(todoList => todoList.id === todolistId);
    }

    async addTodoList(user: UserEntity, todoList: TodoListResponse){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        todoLists.push(todoList);
        await this.cacheManager.set(`todos-${user.id}`, todoLists, this.todoListCacheTtl);
    }

    async updateTodoList(user: UserEntity, todoList: TodoListResponse){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        const index = todoLists.findIndex(t => t.id === todoList.id);
        if(index !== -1)
            todoLists[index] = todoList;
        await this.cacheManager.set(`todos-${user.id}`, todoLists, this.todoListCacheTtl);
    }

    async deleteTodoList(user: UserEntity, todolistId: number){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        const index = todoLists.findIndex(t => t.id === todolistId);
        if(index !== -1)
            todoLists.splice(index, 1);
        await this.cacheManager.set(`todos-${user.id}`, todoLists, this.todoListCacheTtl);
    }

    async completeTodoList(user: UserEntity, todolistId: number, count: number){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        const index = todoLists.findIndex(t => t.id === todolistId);
        if(index === -1)
            return;
        const todoList = todoLists[index];
        if(todoList.todo_count !== count)
            throw new InternalServerErrorException("Todo list count mismatch in cache");
        todoList.completed_todo_count = count;
        await this.cacheManager.set(`todos-${user.id}`, todoLists, this.todoListCacheTtl);
    }

    async todoAdded(user: UserEntity, todolistId: number){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        const index = todoLists.findIndex(t => t.id === todolistId);
        if(index === -1)
            return;
        const todoList = todoLists[index];
        todoList.todo_count++;
        await this.cacheManager.set(`todos-${user.id}`, todoLists, this.todoListCacheTtl);
    }

    async todoRemoved(user: UserEntity, todolistId: number, isCompleted: boolean){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        const index = todoLists.findIndex(t => t.id === todolistId);
        if(index === -1)
            return;
        const todoList = todoLists[index];
        todoList.todo_count--;
        if(isCompleted)
            todoList.completed_todo_count--;
        await this.cacheManager.set(`todos-${user.id}`, todoLists, this.todoListCacheTtl);
    }

    async todoCompleted(user: UserEntity, todolistId: number, completed: boolean){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        const index = todoLists.findIndex(t => t.id === todolistId);
        if(index === -1)
            return;
        const todoList = todoLists[index];
        if(completed)
            todoList.completed_todo_count++;
        else
            todoList.completed_todo_count--;
        await this.cacheManager.set(`todos-${user.id}`, todoLists, this.todoListCacheTtl);
    }
}
