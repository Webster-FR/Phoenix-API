import {VerificationCodesModule} from "./verification-codes/verification-codes.module";
import {VersionModule} from "./version/version.module";
import {TodosModule} from "./todos/todos.module";
import {UsersModule} from "./users/users.module";
import {AuthModule} from "./auth/auth.module";
import {TipsModule} from "./tips/tips.module";
import {ConfigModule} from "@nestjs/config";
import {Module} from "@nestjs/common";

@Module({
    imports: [AuthModule, VersionModule, ConfigModule.forRoot({isGlobal: true}), UsersModule, VerificationCodesModule, TodosModule, TipsModule],
})
export class AppModule{}
