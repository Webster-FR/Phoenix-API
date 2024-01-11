import {SecretsService} from "../security/secrets/secrets.service";
import {Injectable, Logger} from "@nestjs/common";
import {Cron} from "@nestjs/schedule";
import {MaintenanceController} from "../misc/maintenance/maintenance.controller";


@Injectable()
export class SecretsRotationTask{

    private readonly logger = new Logger(SecretsRotationTask.name);

    constructor(
        private readonly secretsService: SecretsService,
    ){}

    @Cron("0 0 0 * * *")
    async handleCron(){
        const maintenanceModeState = MaintenanceController.isMaintenanceMode;
        MaintenanceController.isMaintenanceMode = true;
        // Wait for all requests to finish
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.logger.log("Running secrets rotation");
        await this.secretsService.runSecretsRotation();
        this.logger.log("Finished secrets rotation");
        MaintenanceController.isMaintenanceMode = maintenanceModeState;
    }
}
