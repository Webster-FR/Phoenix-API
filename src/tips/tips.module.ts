import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {TipsController} from "./tips.controller";
import {TipsService} from "./tips.service";
import {Module} from "@nestjs/common";

@Module({
    controllers: [TipsController],
    providers: [TipsService],
    imports: [ServicesModule, UsersModule]
})
export class TipsModule{}
