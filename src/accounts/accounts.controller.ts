import {Controller, Delete, Get, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {AccountsService} from "./accounts.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {MaintenanceGuard} from "../maintenance/guards/maintenance.guard";
import {AtGuard} from "../auth/guards/at.guard";
import {AccountEntity} from "./models/entities/account.entity";

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
    async getAccounts(@Req() req: any): Promise<AccountEntity[]>{
        return this.accountsService.getAccounts(req.user.id);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async createAccount(): Promise<AccountEntity>{
        return null;
    }

    @Patch(":id/name")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async updateAccountName(): Promise<AccountEntity>{
        return null;
    }

    @Delete()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async deleteAccount(): Promise<AccountEntity>{
        return null;
    }

}
