import {Module} from "@nestjs/common";
import {LedgersService} from "./ledgers.service";
import {ServicesModule} from "../services/services.module";
import {AccountsModule} from "../accounts/accounts.module";
import {UsersModule} from "../users/users.module";

@Module({
    providers: [LedgersService],
    imports: [ServicesModule, AccountsModule, UsersModule],
    exports: [LedgersService]
})
export class LedgersModule{}
