import {Module} from "@nestjs/common";
import {AuthModule} from "./modules/security/auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";
import {CronModule} from "./common/cron/cron.module";
import {CacheModule} from "@nestjs/cache-manager";
import {TokenCacheService} from "./modules/cache/token-cache.service";
import {CacheModule as InternalCacheModule} from "./modules/cache/cache.module";
import {ServicesModule} from "./common/services/services.module";
import type {RedisClientOptions} from "redis";
import * as redisStore from "cache-manager-redis-store";
import {MiscModule} from "./modules/misc/misc.module";
import {SecurityModule} from "./modules/security/security.module";
import {PasswordRecoveryModule} from "./modules/security/password-recovery/password-recovery.module";
import {GlobalTasksModule} from "./modules/tasks/global-tasks.module";

import * as dotenv from "dotenv";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {MaintenanceGuard} from "./modules/misc/admin/guards/maintenance.guard";
import {AtGuard} from "./modules/security/auth/guards/at.guard";
import {UsersModule} from "./modules/security/users/users.module";
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
            limit: 10000,
        }]),
        AuthModule,
        GlobalTasksModule,
        CronModule,
        InternalCacheModule,
        ServicesModule,
        MiscModule,
        SecurityModule,
        PasswordRecoveryModule,
        UsersModule,
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
        {
            provide: APP_GUARD,
            useClass: AtGuard,
        },
        TokenCacheService
    ],
})
export class AppModule{}
