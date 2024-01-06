import {Module} from "@nestjs/common";
import {TokenCleanupTask} from "./token-cleanup.task";
import {ServicesModule} from "../services/services.module";

@Module({
    providers: [TokenCleanupTask],
    imports: [ServicesModule],
})
export class TasksModule{}
