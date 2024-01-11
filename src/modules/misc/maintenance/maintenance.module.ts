import {Module} from "@nestjs/common";
import {MaintenanceController} from "./maintenance.controller";

@Module({
    controllers: [MaintenanceController]
})
export class MaintenanceModule{}
