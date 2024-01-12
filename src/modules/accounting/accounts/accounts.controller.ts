import {Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {AccountsService} from "./accounts.service";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {MaintenanceGuard} from "../../misc/maintenance/guards/maintenance.guard";
import {AtGuard} from "../../security/auth/guards/at.guard";
import {AccountEntity} from "./models/entities/account.entity";
import {CreateAccountDto} from "./models/dto/create-account.dto";
import {RenameAccountDto} from "./models/dto/rename-account.dto";
import {IdDto} from "../../../common/models/dto/id.dto";

@Controller("accounts")
@ApiTags("Accounts")
@UseGuards(MaintenanceGuard)
export class AccountsController{

    constructor(
        private readonly accountsService: AccountsService
    ){}

    @Get()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Get all accounts", type: AccountEntity, isArray: true})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async getAccounts(@Req() req: any): Promise<AccountEntity[]>{
        return await this.accountsService.getAccounts(req.user);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, description: "Create an account", type: AccountEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    @ApiResponse({status: HttpStatus.CONFLICT, description: "Account already exists"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid or missing fields"})
    async createAccount(@Req() req: any, @Body() createAccountDto: CreateAccountDto): Promise<AccountEntity>{
        return await this.accountsService.createAccount(req.user, createAccountDto.name, createAccountDto.amount, createAccountDto.bank_id);
    }

    @Patch(":id/name")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Update account name", type: AccountEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User or account not found"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid or missing fields"})
    async updateAccountName(@Req() req: any, @Param() idDto: IdDto, @Body() renameAccountDto: RenameAccountDto): Promise<AccountEntity>{
        return await this.accountsService.updateAccountName(req.user, idDto.id, renameAccountDto.name);
    }

    @Delete(":id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Delete an account", type: AccountEntity})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Invalid or missing access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User or account not found"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid or missing id"})
    async deleteAccount(@Req() req: any, @Param() idDto: IdDto): Promise<void>{
        await this.accountsService.deleteAccount(req.user, idDto.id);
    }
}
