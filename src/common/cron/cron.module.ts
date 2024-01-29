import {Module} from "@nestjs/common";
import {TokenCleanupCron} from "./token-cleanup.cron";
import {ServicesModule} from "../services/services.module";
import {UserCleanupCron} from "./user-cleanup.cron";
import {SecretsRotationCron} from "./secrets-rotation.cron";
import {UsersModule} from "../../modules/security/users/users.module";
import {SecretsModule} from "../../modules/security/secrets/secrets.module";
import {TipsModule} from "../../modules/misc/tips/tips.module";
import {TipsRandomizingCron} from "./tips-randomizing.cron";
import {AuthModule} from "../../modules/security/auth/auth.module";
import {StatisticsCron} from "./statistics.cron";
import {StatisticsModule} from "../../modules/misc/statistics/statistics.module";

@Module({
    providers: [TokenCleanupCron, UserCleanupCron, SecretsRotationCron, TipsRandomizingCron, StatisticsCron],
    imports: [ServicesModule, UsersModule, SecretsModule, TipsModule, AuthModule, StatisticsModule],
})
export class CronModule{}
