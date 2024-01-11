import {Module} from "@nestjs/common";
import {TodosService} from "./todos.service";
import {TodosController} from "./todos.controller";
import {ServicesModule} from "../../common/services/services.module";
import {UsersModule} from "../security/users/users.module";
import {AuthModule} from "../security/auth/auth.module";
import {CacheModule} from "../cache/cache.module";

@Module({
    controllers: [TodosController],
    providers: [TodosService],
    imports: [ServicesModule, UsersModule, AuthModule, CacheModule],
    exports: [TodosService],
})
export class TodosModule{}
