import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {TodoEntity} from "../todos/todos/models/entities/todo.entity";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TodoCacheService{

    private readonly todoCacheTtl = parseInt(this.configService.get("TODO_CACHE_TTL"));

    constructor(
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getTodos(userId: number, todoListId: number): Promise<TodoEntity[]>{
        const todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            return null;
        const todoList = todoLists[todoListId];
        if(!todoList)
            return null;
        return todoList;
    }

    async setTodos(userId: number, todoListId: number, todos: TodoEntity[]){
        let todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            todoLists = [];
        todoLists[todoListId] = todos;
        await this.cacheManager.set(`todos_${userId}`, todoLists, this.todoCacheTtl);
    }

    async addTodo(userId: number, todo: TodoEntity){
        const todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            return;
        const todoList = todoLists[todo.todo_list_id];
        if(!todoList)
            return;
        todoList.push(todo);
        await this.cacheManager.set(`todos_${userId}`, todoLists, this.todoCacheTtl);
    }

    async removeTodo(userId: number, todoId: number){
        const todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            return;
        for(const todoList of todoLists){
            if(!todoList)
                continue;
            for(const todo of todoList){
                if(todo.id === todoId){
                    todoList.splice(todoList.indexOf(todo), 1);
                    await this.cacheManager.set(`todos_${userId}`, todoLists, this.todoCacheTtl);
                    return;
                }
            }
        }
    }

    async completeTodo(userId: number, todoId: number, completed: boolean){
        const todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            return;
        for(const todoList of todoLists){
            if(!todoList)
                continue;
            for(const todo of todoList){
                if(todo.id === todoId){
                    todo.completed = completed;
                    await this.cacheManager.set(`todos_${userId}`, this.todoCacheTtl);
                    return;
                }
            }
        }
    }

    async updateTodo(userId: number, todo: TodoEntity){
        const todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            return;
        for(const todoList of todoLists){
            if(!todoList)
                continue;
            for(const cachedTodo of todoList){
                if(cachedTodo.id === todo.id){
                    cachedTodo.name = todo.name;
                    cachedTodo.deadline = todo.deadline;
                    await this.cacheManager.set(`todos_${userId}`, todoLists, this.todoCacheTtl);
                    return;
                }
            }
        }
    }

    async completeAll(userId: number, todoListId: number){
        const todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            return;
        const todoList = todoLists[todoListId];
        if(!todoList)
            return;
        for(const todo of todoList)
            todo.completed = true;
        await this.cacheManager.set(`todos_${userId}`, todoLists, this.todoCacheTtl);
    }
}
