import {Module} from "@nestjs/common";
import {TipsService} from "./tips.service";
import {TipsController} from "./tips.controller";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";

@Module({
    controllers: [TipsController],
    providers: [TipsService],
    imports: [ServicesModule, UsersModule]
})
export class TipsModule{}
