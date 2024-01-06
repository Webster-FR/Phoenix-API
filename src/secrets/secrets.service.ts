import {Injectable} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {UserEntity} from "../users/models/entities/user.entity";
import {UsersService} from "../users/users.service";
import {EncryptionService} from "../services/encryption.service";
import {TodosService} from "../todos/todos.service";


@Injectable()
export class SecretsService{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly todosService: TodosService,
    ){}

    async runSecretsRotation(){
        const users: UserEntity[] = await this.usersService.findAll();
        for(const user of users){
            const secret = user.secret;
            const newSecret = this.encryptionService.generateSecret();
            await this.rotateTodos(user, secret, newSecret);
            await this.usersService.setUserSecret(user, newSecret);
        }
    }

    async rotateTodos(user: UserEntity, secret: string, newSecret: string){
        const todos = await this.todosService.getTodos(user.id);
        for(const todo of todos){
            const encryptedName = this.encryptionService.encryptSymmetric(todo.name, newSecret);
            await this.prismaService.todos.update({
                where: {
                    id: todo.id
                },
                data: {
                    name: encryptedName
                },
            });
        }
    }
}
