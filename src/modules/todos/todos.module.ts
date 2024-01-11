import {Module} from "@nestjs/common";
import {TodosService} from "./todos.service";
import {TodosController} from "./todos.controller";
import {ServicesModule} from "../../common/services/services.module";
import {UsersModule} from "../../users/users.module";
import {AuthModule} from "../../auth/auth.module";

@Module({
    controllers: [TodosController],
    providers: [TodosService],
    imports: [ServicesModule, UsersModule, AuthModule],
    exports: [TodosService],
})
export class TodosModule{}
