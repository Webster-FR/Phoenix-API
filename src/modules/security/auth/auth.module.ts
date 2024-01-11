import {AuthController} from "./auth.controller";
import {AtGuard} from "./guards/at.guard";
import {AuthService} from "./auth.service";
import {forwardRef, Module} from "@nestjs/common";
import {ServicesModule} from "../../../common/services/services.module";
import {UsersModule} from "../users/users.module";
import {VerificationCodesModule} from "../verification-codes/verification-codes.module";
import {TokensService} from "./tokens.service";
import {CacheModule} from "../../cache/cache.module";
import {RtGuard} from "./guards/rt.guard";

@Module({
    controllers: [AuthController],
    providers: [AuthService, AtGuard, RtGuard, TokensService],
    exports: [AtGuard, TokensService, AuthService],
    imports: [ServicesModule, forwardRef(() => UsersModule), VerificationCodesModule, CacheModule]
})
export class AuthModule{}
