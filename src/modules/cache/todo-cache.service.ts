import {Inject, Injectable} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";
import {EncryptionService} from "../../common/services/encryption.service";
import {UserEntity} from "../security/users/models/entities/user.entity";
import {TodoEntity} from "../todos/models/entities/todo.entity";

@Injectable()
export class TodoCacheService{

    constructor(
        private readonly encryptionService: EncryptionService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async getTodos(user: UserEntity){
        return await this.cacheManager.get<TodoEntity[]>(`todos-${user.id}`);
    }

    async getTodo(user: UserEntity, todoId: number){
        const todos: TodoEntity[] = await this.getTodos(user);
        if(!todos)
            return null;
        return todos.find(todo => todo.id === todoId);
    }

    async updateTodos(user: UserEntity, todos: TodoEntity[]){
        let cachedTodos: TodoEntity[] = await this.getTodos(user);
        if(!cachedTodos)
            cachedTodos = [];
        for(const todo of todos){
            const index = cachedTodos.findIndex(t => t.id === todo.id);
            if(index === -1)
                cachedTodos.push(todo);
            else
                cachedTodos[index] = todo;
        }
        await this.cacheManager.set(`todos-${user.id}`, cachedTodos, 0);
    }

    async addTodo(user: UserEntity, todo: TodoEntity){
        const cachedTodos: TodoEntity[] = await this.getTodos(user);
        if(!cachedTodos)
            return;
        cachedTodos.push(todo);
        await this.cacheManager.set(`todos-${user.id}`, cachedTodos, 0);
    }

    async updateTodo(user: UserEntity, todo: TodoEntity){
        const cachedTodos: TodoEntity[] = await this.getTodos(user);
        if(!cachedTodos)
            return;
        const index = cachedTodos.findIndex(t => t.id === todo.id);
        if(index !== -1)
            cachedTodos[index] = todo;
        await this.cacheManager.set(`todos-${user.id}`, cachedTodos, 0);
    }

    async setCompleted(user: UserEntity, todoId: number, completed: boolean){
        const todo = await this.getTodo(user, todoId);
        if(!todo)
            return;
        todo.completed = completed;
        await this.updateTodo(user, todo);
    }

    async deleteTodo(user: UserEntity, todoId: number, children: boolean){
        const cachedTodos: TodoEntity[] = await this.getTodos(user);
        if(!cachedTodos)
            return;
        if(children){
            await this.deleteTodoChildren(user, todoId);
        }else{
            for(const todo of cachedTodos)
                if(todo.parent_id === todoId)
                    todo.parent_id = null;
        }
        await this.cacheManager.set(`todos-${user.id}`, cachedTodos.filter(t => t.id !== todoId), 0);
    }

    async deleteTodoChildren(user: UserEntity, todoId: number){
        const cachedTodos: TodoEntity[] = await this.getTodos(user);
        if(!cachedTodos)
            return;
        await this.cacheManager.set(`todos-${user.id}`, cachedTodos.filter(t => t.parent_id !== todoId), 0);
    }
}
