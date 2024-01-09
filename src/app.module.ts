import {Module} from "@nestjs/common";
import {AuthModule} from "./auth/auth.module";
import {VersionModule} from "./version/version.module";
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "./users/users.module";
import {VerificationCodesModule} from "./verification-codes/verification-codes.module";
import {TodosModule} from "./todos/todos.module";
import {TipsModule} from "./tips/tips.module";
import {MaintenanceModule} from "./maintenance/maintenance.module";
import {BanksModule} from "./banks/banks.module";
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./tasks/tasks.module";
import {SecretsModule} from "./secrets/secrets.module";
import {AccountsModule} from "./accounts/accounts.module";
import {LedgersModule} from "./ledgers/ledgers.module";
import {TransactionsModule} from "./transactions/transactions.module";
import {TransactionCategoriesModule} from "./transaction-categories/transaction-categories.module";
import {CacheModule} from "@nestjs/cache-manager";
import {CacheService} from "./cache/cache.service";
import {CacheModule as InternalCacheModule} from "./cache/cache.module";
import {ServicesModule} from "./services/services.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        ScheduleModule.forRoot(),
        CacheModule.register({isGlobal: true}),
        AuthModule,
        VersionModule,
        UsersModule,
        VerificationCodesModule,
        TodosModule,
        TipsModule,
        MaintenanceModule,
        BanksModule,
        TasksModule,
        SecretsModule,
        AccountsModule,
        LedgersModule,
        TransactionsModule,
        TransactionCategoriesModule,
        InternalCacheModule,
        ServicesModule,
    ],
    providers: [CacheService],
})
export class AppModule{}
