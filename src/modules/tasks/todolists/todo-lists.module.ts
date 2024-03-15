import {Module} from "@nestjs/common";
import {TodoListsService} from "./todo-lists.service";
import {TodoListsController} from "./todo-lists.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {CacheModule} from "../../cache/cache.module";

@Module({
    controllers: [TodoListsController],
    providers: [TodoListsService],
    imports: [ServicesModule, CacheModule],
    exports: [TodoListsService]
})
export class TodoListsModule{}
