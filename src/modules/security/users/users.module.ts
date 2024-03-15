import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {ServicesModule} from "../../../common/services/services.module";
import {VerificationCodesModule} from "../verification-codes/verification-codes.module";
import {CacheModule} from "../../cache/cache.module";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports: [ServicesModule, VerificationCodesModule, CacheModule]
})
export class UsersModule{}
