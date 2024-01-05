import {VerificationCodesModule} from "../verification-codes/verification-codes.module";
import {ServicesModule} from "../services/services.module";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {Module} from "@nestjs/common";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports: [ServicesModule, VerificationCodesModule]
})
export class UsersModule{}
