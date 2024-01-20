import {Body, Controller, ForbiddenException, HttpStatus, Post, Res, UnauthorizedException} from "@nestjs/common";
import {MaintenanceDto} from "./models/dto/maintenance.dto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {FastifyReply} from "fastify";
import {MaintenanceExclusion} from "./decorators/maintenance.decorator";
import {DisableMaintenanceDto} from "./models/dto/disable-maintenance.dto";

@Controller("maintenance")
@ApiTags("Maintenance")
@MaintenanceExclusion()
export class MaintenanceController{

    static isMaintenanceMode: boolean = false;
    static maintenanceMessage: string = "Our services are undergoing maintenance and will therefore be temporarily unavailable!";

    constructor(
        private readonly configService: ConfigService
    ){}

    @Post("/enable")
    @ApiResponse({status: HttpStatus.NO_CONTENT, description: "Maintenance mode was enabled"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid maintenance key"})
    async enableMaintenanceMode(@Res() res: FastifyReply, @Body() maintenanceDto: MaintenanceDto): Promise<void>{
        if(maintenanceDto.maintenance_secret !== this.configService.get("MAINTENANCE_SECRET"))
            throw new UnauthorizedException("Invalid maintenance key");
        MaintenanceController.isMaintenanceMode = true;
        if(maintenanceDto.message)
            MaintenanceController.maintenanceMessage = maintenanceDto.message;
        return res.status(HttpStatus.NO_CONTENT).send();
    }

    @Post("/disable")
    @ApiResponse({status: HttpStatus.NO_CONTENT, description: "Maintenance mode was disabled"})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: "Maintenance mode is already disabled"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid maintenance key"})
    async disableMaintenanceMode(@Res() res: FastifyReply, @Body() maintenanceDto: DisableMaintenanceDto): Promise<void>{
        if(maintenanceDto.maintenance_secret !== this.configService.get("MAINTENANCE_SECRET"))
            throw new UnauthorizedException("Invalid maintenance key");
        if(!MaintenanceController.isMaintenanceMode)
            throw new ForbiddenException("Maintenance mode is already disabled");
        MaintenanceController.isMaintenanceMode = false;
        MaintenanceController.maintenanceMessage = "Our services are undergoing maintenance and will therefore be temporarily unavailable!";
        return res.status(HttpStatus.NO_CONTENT).send();
    }
}
