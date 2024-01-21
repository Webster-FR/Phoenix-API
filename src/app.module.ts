import {Module} from "@nestjs/common";
import {AuthModule} from "./modules/security/auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./modules/tasks/tasks.module";
import {CacheModule} from "@nestjs/cache-manager";
import {TokenCacheService} from "./modules/cache/token-cache.service";
import {CacheModule as InternalCacheModule} from "./modules/cache/cache.module";
import {ServicesModule} from "./common/services/services.module";
import type {RedisClientOptions} from "redis";
import * as redisStore from "cache-manager-redis-store";
import {MiscModule} from "./modules/misc/misc.module";
import {AccountingModule} from "./modules/accounting/accounting.module";
import {SecurityModule} from "./modules/security/security.module";
import {PasswordRecoveryModule} from "./modules/security/password-recovery/password-recovery.module";
import {GlobalTodosModule} from "./modules/todos/global-todos.module";

import * as dotenv from "dotenv";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {MaintenanceGuard} from "./modules/misc/admin/guards/maintenance.guard";
dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        ScheduleModule.forRoot(),
        process.env.REDIS_URL === "" ? (() => {
            console.log("Using in-memory cache");
            return CacheModule.register({isGlobal: true});
        })() : (() => {
            console.log("Using Redis cache");
            return CacheModule.register<RedisClientOptions>({
                isGlobal: true,
                store: redisStore,
                url: process.env.REDIS_URL,
                password: process.env.REDIS_PASSWORD === "" ? undefined : process.env.REDIS_PASSWORD,
            });
        })(),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100,
        }]),
        AuthModule,
        GlobalTodosModule,
        TasksModule,
        InternalCacheModule,
        ServicesModule,
        MiscModule,
        AccountingModule,
        SecurityModule,
        PasswordRecoveryModule
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: MaintenanceGuard,
        },
        TokenCacheService
    ],
})
export class AppModule{}
