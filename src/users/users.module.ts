import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {ServicesModule} from "../services/services.module";
import {VerificationCodesModule} from "../verification-codes/verification-codes.module";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports: [ServicesModule, VerificationCodesModule, CacheModule.register()]
})
export class UsersModule{}
