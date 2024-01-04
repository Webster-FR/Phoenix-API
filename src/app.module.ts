import {Module} from "@nestjs/common";
import {AuthModule} from "./auth/auth.module";
import {VersionModule} from "./version/version.module";
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "./users/users.module";
import {VerificationCodesModule} from "./verification-codes/verification-codes.module";

@Module({
    imports: [AuthModule, VersionModule, ConfigModule.forRoot({isGlobal: true}), UsersModule, VerificationCodesModule],
})
export class AppModule{}
