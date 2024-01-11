import {Module} from "@nestjs/common";
import {PasswordRecoveryService} from "./password-recovery.service";
import {PasswordRecoveryController} from "./password-recovery.controller";
import {UsersModule} from "../users/users.module";

@Module({
    controllers: [PasswordRecoveryController],
    providers: [PasswordRecoveryService],
    imports: [UsersModule],
})
export class PasswordRecoveryModule{}
