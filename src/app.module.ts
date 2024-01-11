import {Module} from "@nestjs/common";
import {AuthModule} from "./modules/security/auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {TodosModule} from "./modules/todos/todos.module";
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./modules/tasks/tasks.module";
import {SecretsModule} from "./modules/security/secrets/secrets.module";
import {CacheModule} from "@nestjs/cache-manager";
import {TokenCacheService} from "./modules/cache/token-cache.service";
import {CacheModule as InternalCacheModule} from "./modules/cache/cache.module";
import {ServicesModule} from "./common/services/services.module";
import type {RedisClientOptions} from "redis";
import * as redisStore from "cache-manager-redis-store";
import {MiscModule} from "./modules/misc/misc.module";
import {AccountingModule} from "./modules/accounting/accounting.module";
import {SecurityModule} from "./modules/security/security.module";

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
        TodosModule,
        TasksModule,
        SecretsModule,
        InternalCacheModule,
        ServicesModule,
        MiscModule,
        AccountingModule,
        SecurityModule
    ],
    providers: [TokenCacheService],
})
export class AppModule{}
