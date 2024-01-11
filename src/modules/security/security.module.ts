import {Module} from "@nestjs/common";
import {VerificationCodesModule} from "./verification-codes/verification-codes.module";
import {UsersModule} from "./users/users.module";
import {SecretsModule} from "./secrets/secrets.module";
import {PasswordRecoveryModule} from "./password-recovery/password-recovery.module";


@Module({
    imports: [VerificationCodesModule, UsersModule, SecretsModule, PasswordRecoveryModule],
})
export class SecurityModule{}
