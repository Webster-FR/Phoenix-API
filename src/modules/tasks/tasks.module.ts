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

@Module({
    providers: [TokenCleanupTask, UserCleanupTask, SecretsRotationTask, TipsRandomizingTask],
    imports: [ServicesModule, UsersModule, SecretsModule, TipsModule, AuthModule],
})
export class TasksModule{}
