import {Module} from "@nestjs/common";
import {TokenCleanupTask} from "./token-cleanup.task";
import {ServicesModule} from "../services/services.module";
import {UserCleanupTask} from "./user-cleanup.task";
import {SecretsRotationTask} from "./secrets-rotation.task";
import {UsersModule} from "../../modules/security/users/users.module";
import {SecretsModule} from "../../modules/security/secrets/secrets.module";
import {TipsModule} from "../../modules/misc/tips/tips.module";
import {TipsRandomizingTask} from "./tips-randomizing.task";
import {AuthModule} from "../../modules/security/auth/auth.module";
import {StatisticsTask} from "./statistics.task";
import {StatisticsModule} from "../../modules/misc/statistics/statistics.module";

@Module({
    providers: [TokenCleanupTask, UserCleanupTask, SecretsRotationTask, TipsRandomizingTask, StatisticsTask],
    imports: [ServicesModule, UsersModule, SecretsModule, TipsModule, AuthModule, StatisticsModule],
})
export class TasksModule{}
