import {Module} from "@nestjs/common";
import {AdminModule} from "./admin/admin.module";
import {TipsModule} from "./tips/tips.module";
import {VersionModule} from "./version/version.module";


@Module({
    imports: [AdminModule, TipsModule, VersionModule],
})
export class MiscModule{}
