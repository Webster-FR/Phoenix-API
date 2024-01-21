import {SetMetadata} from "@nestjs/common";

export function MaintenanceExclusion(){
    return SetMetadata("maintenanceExclusion", true);
}
