import {Body, Controller, Delete, Get, HttpStatus, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {MaintenanceGuard} from "../maintenance/guards/maintenance.guard";
import {ApiBearerAuth, ApiResponse} from "@nestjs/swagger";
import {AtGuard} from "../auth/guards/at.guard";
import {BanksService} from "./banks.service";
import {BankEntity} from "./models/entities/bank.entity";
import {AddBankDto} from "./models/dto/add-bank.dto";

@Controller("banks")
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
        return this.banksService.getBanks(req.user.id);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, description: "Bank added", type: BankEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    @ApiResponse({status: HttpStatus.CONFLICT, description: "Bank already exists"})
    async addBank(@Req() req: any, @Body() addBankDto: AddBankDto): Promise<BankEntity>{
        return this.banksService.addBank(req.user.id, addBankDto.name);
    }

    @Patch(":id/name")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Bank name updated", type: BankEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    async updateBankName(): Promise<BankEntity>{
        // TODO: Update bank name
        return null;
    }

    @Delete(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Bank deleted", type: BankEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    async deleteBank(): Promise<BankEntity>{
        // TODO: Delete bank
        return null;
    }
}
