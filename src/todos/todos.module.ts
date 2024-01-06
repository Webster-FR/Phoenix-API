import {Module} from "@nestjs/common";
import {TodosService} from "./todos.service";
import {TodosController} from "./todos.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";

@Module({
    controllers: [TodosController],
    providers: [TodosService],
    imports: [ServicesModule, UsersModule],
    exports: [TodosService],
})
export class TodosModule{}
