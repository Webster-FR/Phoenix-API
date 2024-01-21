import {Injectable, Logger} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {UserEntity} from "../users/models/entities/user.entity";
import {UsersService} from "../users/users.service";
import {EncryptionService} from "../../../common/services/encryption.service";
import {TodosService} from "../../todos/todos/todos.service";
import {TodoListsService} from "../../todos/todo-lists/todo-lists.service";
import {Prisma} from "@prisma/client/extension";
import {AdminController} from "../../misc/admin/admin.controller";


@Injectable()
export class SecretsService{

    private readonly logger: Logger = new Logger(SecretsService.name);

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly todosService: TodosService,
        private readonly todolistsService: TodoListsService,
    ){}

    async runSecretsRotation(){
        const maintenanceModeState = AdminController.isMaintenanceMode;
        const maintenanceModeMessage = AdminController.maintenanceMessage;
        AdminController.isMaintenanceMode = true;
        AdminController.maintenanceMessage = "Rotating secrets...";
        const users: UserEntity[] = await this.usersService.findAll();
        const promises = [];
        for(const user of users)
            promises.push(this.rotateUserSecret(user));
        await Promise.all(promises);
        AdminController.isMaintenanceMode = maintenanceModeState;
        AdminController.maintenanceMessage = maintenanceModeMessage;
    }

    async rotateUserSecret(user: UserEntity){
        const start = Date.now();
        const secret = user.secret;
        const newSecret = this.encryptionService.generateSecret();
        await this.prismaService.$transaction(async(tx: Prisma.TransactionClient) => {
            const promises = [];
            promises.push(this.todolistsService.rotateEncryptionKey(tx, user, secret, newSecret));
            promises.push(this.todosService.rotateEncryptionKey(tx, user, secret, newSecret));
            await Promise.all(promises);
            await this.usersService.setUserSecret(tx, user, newSecret);
        });
        const stop = Date.now();
        this.logger.log(`Rotated user ${user.id} in ${stop - start}ms`);
    }
}
