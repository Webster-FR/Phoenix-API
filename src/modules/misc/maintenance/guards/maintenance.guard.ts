import {CanActivate, Injectable, ServiceUnavailableException} from "@nestjs/common";
import {MaintenanceController} from "../maintenance.controller";

@Injectable()
export class MaintenanceGuard implements CanActivate{
    async canActivate(): Promise<boolean>{
        if(MaintenanceController.isMaintenanceMode)
            throw new ServiceUnavailableException("Maintenance mode enabled");
        return true;
    }
}
