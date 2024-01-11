import {Module} from "@nestjs/common";
import {AuthModule} from "./auth/auth.module";
import {VersionModule} from "./version/version.module";
import {ConfigModule} from "@nestjs/config";
import {UsersModule} from "./users/users.module";
import {VerificationCodesModule} from "./verification-codes/verification-codes.module";
import {TodosModule} from "./modules/todos/todos.module";
import {TipsModule} from "./tips/tips.module";
import {MaintenanceModule} from "./maintenance/maintenance.module";
import {BanksModule} from "./modules/accounting/banks/banks.module";
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./tasks/tasks.module";
import {SecretsModule} from "./secrets/secrets.module";
import {AccountsModule} from "./modules/accounting/accounts/accounts.module";
import {LedgersModule} from "./modules/accounting/ledgers/ledgers.module";
import {TransactionsModule} from "./transactions/transactions.module";
import {TransactionCategoriesModule} from "./modules/accounting/transaction-categories/transaction-categories.module";
import {CacheModule} from "@nestjs/cache-manager";
import {TokenCacheService} from "./cache/token-cache.service";
import {CacheModule as InternalCacheModule} from "./cache/cache.module";
import {ServicesModule} from "./common/services/services.module";
import type {RedisClientOptions} from "redis";
import * as redisStore from "cache-manager-redis-store";

const redisUrl = process.env.REDIS_URL;
const redisPassword = process.env.REDIS_PASSWORD;

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        ScheduleModule.forRoot(),
        !redisUrl || redisUrl === "" ? CacheModule.register({isGlobal: true}) : CacheModule.register<RedisClientOptions>({
            store: redisStore,
            url: redisUrl,
            password: redisPassword,
            isGlobal: true,
        }),
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
    providers: [TokenCacheService],
})
export class AppModule{}
