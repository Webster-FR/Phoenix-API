import {Controller, Get, UseGuards} from "@nestjs/common";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {ConfigService} from "@nestjs/config";
import {VersionResponse} from "./model/version.response";
import {MaintenanceGuard} from "../modules/misc/maintenance/guards/maintenance.guard";

@Controller("version")
@ApiTags("Version")
@UseGuards(MaintenanceGuard)
export class VersionController{

    constructor(private readonly configService: ConfigService){}

    @Get()
    @ApiResponse({status: 200, description: "Returns the version of the application", type: VersionResponse})
    getVersion(): VersionResponse{
        return {version: this.configService.get<string>("npm_package_version")};
    }
}
