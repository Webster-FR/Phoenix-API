import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {TodoEntity} from "../todos/todos/models/entities/todo.entity";

@Injectable()
export class TodoCacheService{

    constructor(
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
        const todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            await this.cacheManager.set(`todos_${userId}`, []);
        const todoLists2: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        todoLists2[todoListId] = todos;
        await this.cacheManager.set(`todos_${userId}`, todoLists2, 0);
    }

    async addTodo(userId: number, todo: TodoEntity){
        const todoLists: TodoEntity[][] = await this.cacheManager.get(`todos_${userId}`);
        if(!todoLists)
            return;
        const todoList = todoLists[todo.todo_list_id];
        if(!todoList)
            return;
        todoList.push(todo);
        await this.cacheManager.set(`todos_${userId}`, todoLists, 0);
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
                    await this.cacheManager.set(`todos_${userId}`, todoLists, 0);
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
                    await this.cacheManager.set(`todos_${userId}`, todoLists);
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
                    await this.cacheManager.set(`todos_${userId}`, todoLists, 0);
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
        await this.cacheManager.set(`todos_${userId}`, todoLists, 0);
    }
}
