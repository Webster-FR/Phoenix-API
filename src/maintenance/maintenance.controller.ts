import {Body, Controller, HttpStatus, Post, Res} from "@nestjs/common";
import {MaintenanceDto} from "./models/dto/maintenance.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {FastifyReply} from "fastify";

@Controller("maintenance")
@ApiTags("Maintenance")
export class MaintenanceController{

    static isMaintenanceMode: boolean = false;

    constructor(
        private readonly configService: ConfigService
    ){}

    @Post()
    @ApiResponse({status: HttpStatus.NO_CONTENT, description: "Maintenance mode set successfully"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Missing required fields"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid code"})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: "Maintenance mode already set"})
    async setMaintenanceMode(@Res() res: FastifyReply, @Body() maintenanceDto: MaintenanceDto): Promise<void>{
        if(maintenanceDto.maintenance_secret === this.configService.get("MAINTENANCE_SECRET")){
            if(MaintenanceController.isMaintenanceMode === maintenanceDto.maintenance_enable)
                return res.status(HttpStatus.FORBIDDEN).send();
            MaintenanceController.isMaintenanceMode = maintenanceDto.maintenance_enable;
            return res.status(HttpStatus.NO_CONTENT).send();
        }else
            return res.status(HttpStatus.UNAUTHORIZED).send();
    }
}
