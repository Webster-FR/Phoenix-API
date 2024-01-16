import {Inject, Injectable, InternalServerErrorException} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {UserEntity} from "../security/users/models/entities/user.entity";
import {TodoListResponse} from "../todos/todo-lists/models/responses/todolist.response";
import {Cache} from "cache-manager";

@Injectable()
export class TodoListCacheService{

    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async setTodoLists(user: UserEntity, todoLists: TodoListResponse[]){
        await this.cacheManager.set(`todos-${user.id}`, todoLists, 0);
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
        await this.cacheManager.set(`todos-${user.id}`, todoLists, 0);
    }

    async updateTodoList(user: UserEntity, todoList: TodoListResponse){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        const index = todoLists.findIndex(t => t.id === todoList.id);
        if(index !== -1)
            todoLists[index] = todoList;
        await this.cacheManager.set(`todos-${user.id}`, todoLists, 0);
    }

    async deleteTodoList(user: UserEntity, todolistId: number){
        const todoLists: TodoListResponse[] = await this.getTodoLists(user);
        if(!todoLists)
            return;
        const index = todoLists.findIndex(t => t.id === todolistId);
        if(index !== -1)
            todoLists.splice(index, 1);
        await this.cacheManager.set(`todos-${user.id}`, todoLists, 0);
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
        await this.cacheManager.set(`todos-${user.id}`, todoLists, 0);
    }
}
