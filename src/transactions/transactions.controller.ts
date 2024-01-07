import {Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, Req, UseGuards} from "@nestjs/common";
import {TransactionsService} from "./transactions.service";
import {MaintenanceGuard} from "../maintenance/guards/maintenance.guard";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AtGuard} from "../auth/guards/at.guard";
import {FutureTransactionEntity} from "./models/entities/future-transaction.entity";
import {AccountIdDto} from "./models/dto/account-id.dto";

@Controller("transactions")
@UseGuards(MaintenanceGuard)
@ApiTags("Transactions")
export class TransactionsController{

    constructor(
        private readonly transactionsService: TransactionsService,
    ){}

    @Get("/:account_id/processed")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async getProcessedTransactions(@Req() req: any, @Param() accountIdDto: AccountIdDto): Promise<Transaction[]>{
        return this.transactionsService.getProcessedTransactions(req.user.id, accountIdDto.account_id);
    }

    @Get("/:account_id/unprocessed")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async getUnprocessedTransactions(@Req() req: any, @Param() accountIdDto: AccountIdDto): Promise<FutureTransactionEntity[]>{
        return null;
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async createTransaction(@Req() req: any){

    }

    @Patch("/:ulid/wording")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async updateTransactionWording(@Req() req: any){

    }

    @Post("/rectification")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async createTransactionRectification(@Req() req: any){

    }


}
