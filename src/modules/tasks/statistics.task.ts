import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {StatisticsService} from "../misc/statistics/statistics.service";


@Injectable()
export class StatisticsTask{

    private readonly logger = new Logger(StatisticsTask.name);

    constructor(
        private readonly statisticsService: StatisticsService,
    ){}

    @Cron("0 0 * * * *")
    async handleCron(){
        this.logger.log("Making statistics record...");
        await this.statisticsService.makeRecord();
        this.logger.log("Finished making statistics record");
    }
}
