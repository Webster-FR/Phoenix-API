import {
    Body,
    Controller, Get,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards
} from "@nestjs/common";
import {MaintenanceDto} from "./models/dto/maintenance.dto";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {MaintenanceExclusion} from "./decorators/maintenance.decorator";
import {AdminGuard} from "./guards/admin.guard";
import {AdminService} from "./admin.service";

@Controller("admin")
@ApiTags("Admin")
@MaintenanceExclusion()
@UseGuards(AdminGuard)
export class AdminController{

    static isMaintenanceMode: boolean = false;
    static maintenanceMessage: string = "Our services are undergoing maintenance and will therefore be temporarily unavailable!";

    constructor(
        private readonly adminService: AdminService,
    ){}

    @Post("/maintenance/enable")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.NO_CONTENT, description: "Maintenance mode was enabled"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid maintenance key"})
    async enableMaintenanceMode(@Body() maintenanceDto: MaintenanceDto): Promise<void>{
        this.adminService.enableMaintenanceMode(maintenanceDto.message);
    }

    @Post("/maintenance/disable")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.NO_CONTENT, description: "Maintenance mode was disabled"})
    @ApiResponse({status: HttpStatus.FORBIDDEN, description: "Maintenance mode is already disabled"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid maintenance key"})
    async disableMaintenanceMode(): Promise<void>{
        this.adminService.disableMaintenanceMode();
    }

    @Post("/secrets/rotate")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.NO_CONTENT, description: "Secrets were rotated"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid admin secret"})
    async runSecretRotation(): Promise<void>{
        await this.adminService.runSecretRotation();
    }

    @Get("/statistics")
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Statistics were fetched"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid admin secret"})
    async getStatistics(): Promise<string>{
        return await this.adminService.getStatistics();
    }
}
