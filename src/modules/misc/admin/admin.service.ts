import {ForbiddenException, forwardRef, Inject, Injectable} from "@nestjs/common";
import {AdminController} from "./admin.controller";
import {SecretsService} from "../../security/secrets/secrets.service";

@Injectable()
export class AdminService{

    constructor(
        @Inject(forwardRef(() => SecretsService))
        private readonly secretsService: SecretsService,
    ){}

    enableMaintenanceMode(message: string = ""): void{
        AdminController.isMaintenanceMode = true;
        if(message)
            AdminController.maintenanceMessage = message;
    }

    disableMaintenanceMode(): void{
        if(!AdminController.isMaintenanceMode)
            throw new ForbiddenException("Maintenance mode is already disabled");
        AdminController.isMaintenanceMode = false;
        AdminController.maintenanceMessage = "Our services are undergoing maintenance and will therefore be temporarily unavailable!";
    }

    async runSecretRotation(): Promise<void>{
        await this.secretsService.runSecretsRotation();
    }
}
