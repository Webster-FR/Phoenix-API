import {Module} from "@nestjs/common";
import {StatisticsService} from "./statistics.service";
import {ServicesModule} from "../../../common/services/services.module";

@Module({
    providers: [StatisticsService],
    imports: [ServicesModule],
    exports: [StatisticsService],
})
export class StatisticsModule{}
