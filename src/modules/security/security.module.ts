import {Module} from "@nestjs/common";
import {VerificationCodesModule} from "./verification-codes/verification-codes.module";
import {UsersModule} from "./users/users.module";


@Module({
    imports: [VerificationCodesModule, UsersModule],
})
export class SecurityModule{}
