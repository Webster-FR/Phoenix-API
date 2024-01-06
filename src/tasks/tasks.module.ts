import {Module} from "@nestjs/common";
import {TokenCleanupTask} from "./token-cleanup.task";
import {ServicesModule} from "../services/services.module";
import {UserCleanupTask} from "./user-cleanup.task";
import {SecretsRotationTask} from "./secrets-rotation.task";
import {UsersModule} from "../users/users.module";
import {SecretsModule} from "../secrets/secrets.module";
import {TipsModule} from "../tips/tips.module";
import {TipsRandomizingTask} from "./tips-randomizing.task";

@Module({
    providers: [TokenCleanupTask, UserCleanupTask, SecretsRotationTask, TipsRandomizingTask],
    imports: [ServicesModule, UsersModule, SecretsModule, TipsModule],
})
export class TasksModule{}
