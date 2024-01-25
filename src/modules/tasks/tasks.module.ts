import {Module} from "@nestjs/common";
import {TokenCleanupTask} from "./token-cleanup.task";
import {ServicesModule} from "../../common/services/services.module";
import {UserCleanupTask} from "./user-cleanup.task";
import {SecretsRotationTask} from "./secrets-rotation.task";
import {UsersModule} from "../security/users/users.module";
import {SecretsModule} from "../security/secrets/secrets.module";
import {TipsModule} from "../misc/tips/tips.module";
import {TipsRandomizingTask} from "./tips-randomizing.task";
import {AuthModule} from "../security/auth/auth.module";
import {StatisticsTask} from "./statistics.task";
import {StatisticsModule} from "../misc/statistics/statistics.module";

@Module({
    providers: [TokenCleanupTask, UserCleanupTask, SecretsRotationTask, TipsRandomizingTask, StatisticsTask],
    imports: [ServicesModule, UsersModule, SecretsModule, TipsModule, AuthModule, StatisticsModule],
})
export class TasksModule{}
