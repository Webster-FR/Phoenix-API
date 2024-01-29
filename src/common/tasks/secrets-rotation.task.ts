import {SecretsService} from "../../modules/security/secrets/secrets.service";
import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";


@Injectable()
export class SecretsRotationTask{

    private readonly logger = new Logger(SecretsRotationTask.name);

    constructor(
        private readonly secretsService: SecretsService,
    ){}

    @Cron("0 0 0 * * *")
    async handleCron(){
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.logger.log("Running secrets rotation");
        await this.secretsService.runSecretsRotation();
        this.logger.log("Finished secrets rotation");
    }
}
