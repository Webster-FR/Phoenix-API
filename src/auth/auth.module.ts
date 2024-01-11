import {AuthController} from "./auth.controller";
import {AtGuard} from "./guards/at.guard";
import {AuthService} from "./auth.service";
import {forwardRef, Module} from "@nestjs/common";
import {ServicesModule} from "../common/services/services.module";
import {UsersModule} from "../modules/security/users/users.module";
import {VerificationCodesModule} from "../verification-codes/verification-codes.module";
import {TokensService} from "./tokens.service";
import {CacheModule} from "../modules/cache/cache.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService, AtGuard, TokensService],
    exports: [AtGuard, TokensService],
    imports: [ServicesModule, forwardRef(() => UsersModule), VerificationCodesModule, CacheModule]
})
export class AuthModule{}
