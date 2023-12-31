import {AuthController} from "./auth.controller";
import {AtGuard} from "./guards/at.guard";
import {AuthService} from "./auth.service";
import {Module} from "@nestjs/common";
import {JwtService} from "../services/jwt.service";
import {EncryptionService} from "../services/encryption.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService, AtGuard, EncryptionService, JwtService],
    exports: [AtGuard]
})
export class AuthModule{}
