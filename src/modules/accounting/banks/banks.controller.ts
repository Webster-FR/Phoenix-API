import {Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {MaintenanceGuard} from "../../misc/maintenance/guards/maintenance.guard";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AtGuard} from "../../security/auth/guards/at.guard";
import {BanksService} from "./banks.service";
import {BankEntity} from "./models/entities/bank.entity";
import {BankNameDto} from "./models/dto/bank-name.dto";
import {IdDto} from "../../../common/models/dto/id.dto";

@Controller("banks")
@ApiTags("Banks")
@UseGuards(MaintenanceGuard)
export class BanksController{
    constructor(
        private readonly banksService: BanksService
    ){}

    @Get()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "User and default banks returned", type: BankEntity, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async getBanks(@Req() req: any): Promise<BankEntity[]>{
        return this.banksService.getBanks(req.user);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, description: "Bank added", type: BankEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    @ApiResponse({status: HttpStatus.CONFLICT, description: "Bank already exists"})
    async addBank(@Req() req: any, @Body() bankNameDto: BankNameDto): Promise<BankEntity>{
        return this.banksService.addBank(req.user, bankNameDto.name);
    }

    @Patch(":id/name")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Bank name updated", type: BankEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User or bank not found"})
    @ApiResponse({status: HttpStatus.CONFLICT, description: "Bank already exists"})
    async updateBankName(@Req() req: any, @Param() idDto: IdDto, @Body() bankNameDto: BankNameDto): Promise<BankEntity>{
        return this.banksService.updateBankName(req.user, idDto.id, bankNameDto.name);
    }

    @Delete(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Bank deleted", type: BankEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User or bank not found"})
    async deleteBank(@Req() req: any, @Param() idDto: IdDto): Promise<void>{
        await this.banksService.deleteBank(req.user, idDto.id);
    }
}
