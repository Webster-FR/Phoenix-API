import {Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards} from "@nestjs/common";
import {TransactionsService} from "./transactions.service";
import {MaintenanceGuard} from "../../../maintenance/guards/maintenance.guard";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AtGuard} from "../../../auth/guards/at.guard";
import {AccountIdDto} from "./models/dto/account-id.dto";
import CreateTransactionDto from "./models/dto/create-transaction.dto";
import {FutureTransactionEntity} from "./models/entities/future-transaction.entity";

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
        return this.transactionsService.getUnprocessedTransactions(req.user.id, accountIdDto.account_id);
    }

    @Post()
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async createTransaction(@Req() req: any, @Body() createTransactionDto: CreateTransactionDto): Promise<Transaction | FutureTransactionEntity>{
        return this.transactionsService.createTransaction(req.user.id, createTransactionDto.wording, createTransactionDto.category_id, createTransactionDto.amount, createTransactionDto.from_account_id, createTransactionDto.to_account_id, createTransactionDto.created_at);
    }

    @Put("/unprocessed/:ulid")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async updateFutureTransaction(){

    }

    @Patch("/:ulid/wording")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async updateTransactionWording(){

    }

    @Post("/rectification")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async createTransactionRectification(){

    }


}
