import {CanActivate, ExecutionContext, Injectable, ServiceUnavailableException} from "@nestjs/common";
import {MaintenanceController} from "../maintenance.controller";
import {Reflector} from "@nestjs/core";

@Injectable()
export class MaintenanceGuard implements CanActivate{

    constructor(
        private reflector: Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const isMaintenanceExcluded = this.reflector.getAllAndOverride<boolean>("maintenanceExclusion", [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isMaintenanceExcluded)
            return true;
        if(MaintenanceController.isMaintenanceMode)
            throw new ServiceUnavailableException(MaintenanceController.maintenanceMessage);
        return true;
    }
}
