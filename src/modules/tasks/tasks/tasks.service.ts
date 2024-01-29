// noinspection TypeScriptValidateJSTypes

import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {CipherService} from "../../../common/services/cipher.service";
import {ConfigService} from "@nestjs/config";
import {TodoCacheService} from "../../cache/todo-cache.service";
import {UserEntity} from "../../security/users/models/entities/user.entity";
import {TaskEntity} from "./models/entities/task.entity";
import {TodoListsService} from "../todolists/todo-lists.service";
import {TodoListCacheService} from "../../cache/todo-list-cache.service";
import {TodoListEntity} from "../todolists/models/entities/todolist.entity";
import {Prisma} from "@prisma/client/extension";

@Injectable()
export class TasksService{

    private readonly tasksEncryptionStrength = parseInt(this.configService.get("TASKS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: CipherService,
        private readonly configService: ConfigService,
        private readonly todoCacheService: TodoCacheService,
        private readonly todoListsService: TodoListsService,
        private readonly todoListCacheService: TodoListCacheService,
    ){}

    decipherTask(user: UserEntity, task: TaskEntity){
        task.name = this.encryptionService.decipherSymmetric(task.name, user.secret, this.tasksEncryptionStrength);
        return task;
    }

    async getTodoListFromTask(user: UserEntity, todoId: number): Promise<TodoListEntity>{
        const task = await this.prismaService.tasks.findUnique({
            where: {
                id: todoId,
            },
            include: {
                todo_list: true,
            }
        });
        if(!task)
            throw new NotFoundException("Todo not found");
        if(task.todo_list.id !== user.id)
            throw new NotFoundException("Todo list not found");
        return task.todo_list;
    }

    async isTaskExists(user: UserEntity, id: number){
        return !!await this.prismaService.tasks.findUnique({
            where: {
                id: id,
                todo_list: {
                    user_id: user.id,
                }
            }
        });
    }

    async getTasks(user: UserEntity, todoListId: number){
        const cachedTasks = await this.todoCacheService.getTasks(user.id, todoListId);
        if(cachedTasks)
            return cachedTasks;
        if(!await this.todoListsService.isTodoListExists(user, todoListId))
            throw new NotFoundException("Todo list not found");
        const tasks: TaskEntity[] = await this.prismaService.tasks.findMany({
            where: {
                todo_list_id: todoListId,
            },
            orderBy: {
                id: "asc",
            }
        });
        const decipheredTasks = await Promise.all(tasks.map(task => this.decipherTask(user, task)));
        await this.todoCacheService.setTasks(user.id, todoListId, decipheredTasks);
        return decipheredTasks;
    }

    async createTask(user: UserEntity, name: string, todoListId: number, deadline: Date){
        if(!await this.todoListsService.isTodoListExists(user, todoListId))
            throw new NotFoundException("Todo list not found");
        const cipheredName = this.encryptionService.cipherSymmetric(name, user.secret, this.tasksEncryptionStrength);
        const task: TaskEntity = await this.prismaService.tasks.create({
            data: {
                name: cipheredName,
                todo_list_id: todoListId,
                deadline: deadline,
            }
        });
        task.name = name;
        await this.todoListCacheService.taskAdded(user, todoListId);
        await this.todoCacheService.addTask(user.id, task);
        return task;
    }

    async updateTask(user: UserEntity, id: number, name: string, deadline: Date, completed: boolean){
        const dbTask = await this.prismaService.tasks.findUnique({
            where: {
                id: id,
            }
        });
        if(!dbTask)
            throw new NotFoundException("Task not found");
        const changeNeeded = dbTask.completed !== completed;
        const cipheredName = this.encryptionService.cipherSymmetric(name, user.secret, this.tasksEncryptionStrength);
        const task: TaskEntity = await this.prismaService.tasks.update({
            where: {
                id: id,
            },
            data: {
                name: cipheredName,
                deadline: deadline,
                completed: completed,
            }
        });
        task.name = name;
        if(changeNeeded)
            await this.todoListCacheService.taskCompleted(user, task.todo_list_id, completed);
        await this.todoCacheService.updateTask(user.id, task);
        return task;
    }

    async completeTask(user: UserEntity, id: number, completed: boolean): Promise<void>{
        if(!await this.isTaskExists(user, id))
            throw new NotFoundException("Task not found");
        await this.prismaService.tasks.update({
            where: {
                id: id,
            },
            data: {
                completed: completed,
            }
        });
        const todoList = await this.getTodoListFromTask(user, id);
        await this.todoListCacheService.taskCompleted(user, todoList.id, completed);
        await this.todoCacheService.completeTask(user.id, id, completed);
    }

    async deleteTask(user: UserEntity, id: number){
        if(!await this.isTaskExists(user, id))
            throw new NotFoundException("Task not found");
        const todoList = await this.getTodoListFromTask(user, id);
        const task = await this.prismaService.tasks.findUnique({
            where: {
                id: id
            }
        });
        await this.todoListCacheService.taskRemoved(user, todoList.id, task.completed);
        await this.prismaService.tasks.delete({
            where: {
                id: id,
            }
        });
        await this.todoCacheService.removeTask(user.id, id);
    }

    async rotateTasksCipher(tx: Prisma.TransactionClient, user: UserEntity, oldKey: string, newKey: string){
        const tasks: TaskEntity[] = await this.prismaService.tasks.findMany({
            where: {
                todo_list: {
                    user_id: user.id,
                }
            }
        });
        const promises = [];
        for(const task of tasks)
            promises.push(this.rotateTaskCipher(tx, task, oldKey, newKey));
        await Promise.all(promises);
    }

    private async rotateTaskCipher(tx: Prisma.TransactionClient, task: TaskEntity, oldKey: string, newKey: string){
        task.name = this.encryptionService.decipherSymmetric(task.name, oldKey, this.tasksEncryptionStrength);
        task.name = this.encryptionService.cipherSymmetric(task.name, newKey, this.tasksEncryptionStrength);
        await tx.tasks.update({
            where: {
                id: task.id,
            },
            data: {
                name: task.name,
            }
        });
    }
}
