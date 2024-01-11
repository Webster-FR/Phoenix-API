import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {TipsService} from "../modules/misc/tips/tips.service";


@Injectable()
export class TipsRandomizingTask{

    private readonly logger = new Logger(TipsRandomizingTask.name);

    constructor(
        private readonly tipsService: TipsService,
    ){}

    @Cron("0 0 0 1 * *")
    async handleCron(){
        this.logger.log("Randomizing tips order");
        await this.tipsService.randomizeTipsOrder();
        this.logger.log("Tips order randomized");
    }
}
