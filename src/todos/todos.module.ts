import {ServicesModule} from "../services/services.module";
import {TodosController} from "./todos.controller";
import {UsersModule} from "../users/users.module";
import {TodosService} from "./todos.service";
import {Module} from "@nestjs/common";

@Module({
    controllers: [TodosController],
    providers: [TodosService],
    imports: [ServicesModule, UsersModule],
})
export class TodosModule{}
