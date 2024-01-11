import {Module} from "@nestjs/common";
import {MaintenanceModule} from "./maintenance/maintenance.module";
import {TipsModule} from "./tips/tips.module";
import {VersionModule} from "./version/version.module";


@Module({
    imports: [MaintenanceModule, TipsModule, VersionModule],
})
export class MiscModule{}
