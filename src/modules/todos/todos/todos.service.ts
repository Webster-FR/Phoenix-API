import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {UsersService} from "../../security/users/users.service";
import {EncryptionService} from "../../../common/services/encryption.service";
import {ConfigService} from "@nestjs/config";
import {TodoCacheService} from "../../cache/todo-cache.service";

@Injectable()
export class TodosService{

    private readonly todosEncryptionStrength = parseInt(this.configService.get("TODOS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
        private readonly todoCacheService: TodoCacheService,
    ){}

    // decryptTodo(user: UserEntity, todo: TodoEntity): TodoEntity{
    //     todo.name = this.encryptionService.decryptSymmetric(todo.name, user.secret, this.todosEncryptionStrength);
    //     return todo;
    // }
    //
    // async isTodoExists(user: UserEntity, todoId: number): Promise<boolean>{
    //     return !!await this.prismaService.todos.findUnique({
    //         where: {
    //             id: todoId,
    //             user_id: user.id
    //         }
    //     });
    // }
    //
    // async getTodos(user: UserEntity): Promise<TodoEntity[]>{
    //     if(!user)
    //         throw new NotFoundException("User not found");
    //     let todos = await this.todoCacheService.getTodos(user);
    //     if(todos)
    //         return todos;
    //     todos = await this.prismaService.todos.findMany({where: {user_id: user.id}});
    //     const decryptedTodos: TodoEntity[] = [];
    //     for(const todo of todos)
    //         decryptedTodos.push(this.decryptTodo(user, todo));
    //     await this.todoCacheService.updateTodos(user, decryptedTodos);
    //     return decryptedTodos;
    // }
    //
    // async findTodoById(user: UserEntity, todoId: number): Promise<TodoEntity>{
    //     let todo = await this.todoCacheService.getTodo(user, todoId);
    //     if(todo)
    //         return todo;
    //     todo = await this.prismaService.todos.findUnique({
    //         where: {
    //             id: todoId,
    //             user_id: user.id
    //         }
    //     });
    //     if(!todo)
    //         throw new NotFoundException("Todo not found");
    //     const decryptedTodo = this.decryptTodo(user, todo);
    //     await this.todoCacheService.updateTodo(user, decryptedTodo);
    //     return decryptedTodo;
    // }
    //
    // async createTodo(user: UserEntity, name: string, deadline: Date, parentId: number, frequency: string, icon: string, color: string): Promise<TodoEntity>{
    //     if(parentId !== undefined){
    //         const parentTodo = await this.findTodoById(user, parentId);
    //         if(parentTodo.parent_id !== null)
    //             throw new InternalServerErrorException("Todo cannot have a parent that has a parent");
    //     }
    //     const todoName = this.encryptionService.encryptSymmetric(name, user.secret, this.todosEncryptionStrength);
    //     const todo: TodoEntity = await this.prismaService.todos.create({
    //         data: {
    //             user_id: user.id,
    //             name: todoName,
    //             deadline: deadline,
    //             parent_id: parentId,
    //             frequency: frequency,
    //             icon: icon,
    //             color: color,
    //         },
    //     });
    //     todo.name = name;
    //     await this.todoCacheService.addTodo(user, todo);
    //     return todo;
    // }
    //
    // async setTodoParent(user: UserEntity, todoId: number, parentId: number): Promise<TodoEntity>{
    //     const parentTodo = await this.findTodoById(user, parentId);
    //     if(parentTodo.parent_id !== null)
    //         throw new InternalServerErrorException("Todo cannot have a parent that has a parent");
    //     if(!await this.isTodoExists(user, todoId))
    //         throw new NotFoundException("Todo not found");
    //     const todo = await this.prismaService.todos.update({
    //         where: {
    //             id: todoId,
    //             user_id: user.id
    //         },
    //         data: {
    //             parent_id: parentId
    //         },
    //     });
    //     if(!todo)
    //         throw new NotFoundException("Todo not found");
    //     const decryptedTodo = this.decryptTodo(user, todo);
    //     await this.todoCacheService.updateTodo(user, decryptedTodo);
    //     return decryptedTodo;
    // }
    //
    // async setTodoCompleted(user: UserEntity, todoId: number, completed: boolean): Promise<void>{
    //     let todo = await this.todoCacheService.getTodo(user, todoId);
    //     if(!todo)
    //         todo = await this.prismaService.todos.findUnique({
    //             where: {
    //                 id: todoId,
    //                 user_id: user.id
    //             }
    //         });
    //     if(!todo)
    //         throw new NotFoundException("Todo not found");
    //     if(!completed){
    //         if(todo.parent_id !== null){
    //             const parent: TodoEntity = await this.prismaService.todos.update({
    //                 where: {
    //                     id: todo.parent_id,
    //                     user_id: user.id
    //                 },
    //                 data: {
    //                     completed: false
    //                 }
    //             });
    //             await this.todoCacheService.setCompleted(user, parent.id, false);
    //             if(!parent)
    //                 throw new NotFoundException("Parent not found");
    //         }
    //         await this.prismaService.todos.update({
    //             where: {
    //                 id: todoId,
    //                 user_id: user.id
    //             },
    //             data: {
    //                 completed: false
    //             }
    //         });
    //         await this.todoCacheService.setCompleted(user, todoId, false);
    //         return;
    //     }
    //     if(todo.parent_id !== null){
    //         await this.prismaService.todos.update({
    //             where: {
    //                 id: todoId,
    //                 user_id: user.id
    //             },
    //             data: {
    //                 completed: true
    //             }
    //         });
    //         await this.todoCacheService.setCompleted(user, todoId, true);
    //         return;
    //     }
    //     const children: TodoEntity[] = await this.prismaService.todos.findMany({
    //         where: {
    //             user_id: user.id,
    //             parent_id: todoId
    //         }
    //     });
    //     for(const child of children)
    //         if(child.completed === false)
    //             throw new PreconditionFailedException("Cannot complete todo because a child is not completed");
    //     await this.prismaService.todos.update({
    //         where: {
    //             id: todoId,
    //             user_id: user.id
    //         },
    //         data: {
    //             completed: true
    //         }
    //     });
    //     await this.todoCacheService.setCompleted(user, todoId, true);
    // }
    //
    // async updateTodo(user: UserEntity, todoId: number, name: string, deadline: Date, parentId: number, frequency: string, icon: string, color: string, completed: boolean): Promise<TodoEntity>{
    //     if(parentId !== undefined){
    //         const parentTodo = await this.findTodoById(user, parentId);
    //         if(parentTodo.parent_id !== null)
    //             throw new InternalServerErrorException("Todo cannot have a parent that has a parent");
    //     }
    //     if(!await this.isTodoExists(user, todoId))
    //         throw new NotFoundException("Todo not found");
    //     const todoName = this.encryptionService.encryptSymmetric(name, user.secret, this.todosEncryptionStrength);
    //     const todo: TodoEntity = await this.prismaService.todos.update({
    //         where: {
    //             id: todoId,
    //             user_id: user.id
    //         },
    //         data: {
    //             name: todoName,
    //             deadline: deadline,
    //             frequency: frequency,
    //             icon: icon,
    //             color: color,
    //             completed: completed,
    //             parent_id: parentId
    //         },
    //     });
    //     if(!todo)
    //         throw new NotFoundException("Todo not found");
    //     todo.name = name;
    //     await this.todoCacheService.updateTodo(user, todo);
    //     return todo;
    // }
    //
    // async deleteTodo(user: UserEntity, todoId: number, children: boolean): Promise<void>{
    //     if(!await this.isTodoExists(user, todoId))
    //         throw new NotFoundException("Todo not found");
    //     if(children)
    //         await this.deleteTodoChildren(user, todoId);
    //     const todo: TodoEntity = await this.prismaService.todos.delete({
    //         where: {
    //             id: todoId
    //         },
    //     });
    //     if(!todo)
    //         throw new NotFoundException("Todo not found");
    //     await this.todoCacheService.deleteTodo(user, todoId, children);
    // }
    //
    // async deleteTodoChildren(user: UserEntity, todoId: number): Promise<void>{
    //     if(!await this.isTodoExists(user, todoId))
    //         throw new NotFoundException("Todo not found");
    //     await this.prismaService.todos.deleteMany({
    //         where: {
    //             user_id: user.id,
    //             parent_id: todoId
    //         },
    //     });
    // }
    //
    // async purgeTodos(user: UserEntity){
    //     let userTodos: TodoEntity[] = await this.todoCacheService.getTodos(user);
    //     if(!userTodos)
    //         userTodos = await this.prismaService.todos.findMany({
    //             where: {
    //                 user_id: user.id
    //             }
    //         });
    //     for(const todo of userTodos)
    //         if(todo.parent_id === null && todo.completed === true){
    //             const children = await this.prismaService.todos.findMany({
    //                 where: {
    //                     user_id: user.id,
    //                     parent_id: todo.id
    //                 }
    //             });
    //             for(const child of children)
    //                 if(child.completed === false)
    //                     throw new PreconditionFailedException("Cannot purge todos because a child is not completed");
    //             await this.deleteTodoChildren(user, todo.id);
    //             await this.prismaService.todos.delete({
    //                 where: {
    //                     id: todo.id
    //                 }
    //             });
    //             await this.todoCacheService.deleteTodo(user, todo.id, true);
    //         }
    // }
}
