import {CanActivate, ExecutionContext, Injectable, ServiceUnavailableException} from "@nestjs/common";
import {AdminController} from "../admin.controller";
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
        if(AdminController.isMaintenanceMode)
            throw new ServiceUnavailableException(AdminController.maintenanceMessage);
        return true;
    }
}
