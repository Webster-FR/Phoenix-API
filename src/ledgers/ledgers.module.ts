import {forwardRef, Module} from "@nestjs/common";
import {LedgersService} from "./ledgers.service";
import {ServicesModule} from "../common/services/services.module";
import {UsersModule} from "../users/users.module";
import {AccountsModule} from "../accounts/accounts.module";

@Module({
    providers: [LedgersService],
    imports: [ServicesModule, UsersModule, forwardRef(() =>AccountsModule)],
    exports: [LedgersService]
})
export class LedgersModule{}
