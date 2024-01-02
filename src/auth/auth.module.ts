import {AuthController} from "./auth.controller";
import {AtGuard} from "./guards/at.guard";
import {AuthService} from "./auth.service";
import {Module} from "@nestjs/common";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService, AtGuard],
    exports: [AtGuard],
    imports: [ServicesModule, UsersModule]
})
export class AuthModule{}
