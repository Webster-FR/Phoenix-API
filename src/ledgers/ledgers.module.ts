import {Module} from "@nestjs/common";
import {LedgersService} from "./ledgers.service";
import {ServicesModule} from "../services/services.module";
import {UsersModule} from "../users/users.module";

@Module({
    providers: [LedgersService],
    imports: [ServicesModule, UsersModule],
    exports: [LedgersService]
})
export class LedgersModule{}
