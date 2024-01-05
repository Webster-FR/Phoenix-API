import {VerificationCodesModule} from "../verification-codes/verification-codes.module";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {AtGuard} from "./guards/at.guard";
import {Module} from "@nestjs/common";

@Module({
    controllers: [AuthController],
    providers: [AuthService, AtGuard],
    exports: [AtGuard],
    imports: [ServicesModule, UsersModule, VerificationCodesModule]
})
export class AuthModule{}
