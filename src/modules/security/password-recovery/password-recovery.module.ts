import {Module} from "@nestjs/common";
import {PasswordRecoveryService} from "./password-recovery.service";
import {PasswordRecoveryController} from "./password-recovery.controller";
import {UsersModule} from "../users/users.module";
import {AuthModule} from "../auth/auth.module";
import {ServicesModule} from "../../../common/services/services.module";

@Module({
    controllers: [PasswordRecoveryController],
    providers: [PasswordRecoveryService],
    imports: [UsersModule, AuthModule, ServicesModule],
})
export class PasswordRecoveryModule{}
