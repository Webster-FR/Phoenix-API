import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from "@nestjs/common";
import {TransactionsService} from "./transactions.service";
import {MaintenanceGuard} from "../maintenance/guards/maintenance.guard";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AtGuard} from "../auth/guards/at.guard";
import {TransactionCategoryEntity} from "./models/entities/transaction-category.entity";
import {TransactionCategoriesService} from "./transaction-categories.service";
import {TransactionCategoryDto} from "./models/dto/transaction-category.dto";
import {IdDto} from "../models/dto/id.dto";

@Controller("transactions")
@UseGuards(MaintenanceGuard)
@ApiTags("Transactions")
export class TransactionsController{
    constructor(
        private readonly transactionsService: TransactionsService,
        private readonly transactionCategoriesService: TransactionCategoriesService,
    ){}

    @Get("/categories")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async getTransactionCategories(@Req() req: any): Promise<TransactionCategoryEntity[]>{
        return this.transactionCategoriesService.getTransactionCategories(req.user.id);
    }

    @Post("/categories")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async createTransactionCategory(@Req() req: any, @Body() transactionCategoryDto: TransactionCategoryDto): Promise<TransactionCategoryEntity>{
        return this.transactionCategoriesService.createTransactionCategory(req.user.id, transactionCategoryDto.name, transactionCategoryDto.icon, transactionCategoryDto.color);
    }

    @Put("/categories/:id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async updateTransactionCategory(@Req() req: any, @Param() idDto: IdDto, @Body() transactionCategoryDto: TransactionCategoryDto): Promise<TransactionCategoryEntity>{
        return this.transactionCategoriesService.updateTransactionCategory(req.user.id, idDto.id, transactionCategoryDto.name, transactionCategoryDto.icon, transactionCategoryDto.color);
    }

    @Delete("/categories/:id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    async deleteTransactionCategory(@Req() req: any, @Param() idDto: IdDto): Promise<TransactionCategoryEntity>{
        return this.transactionCategoriesService.deleteTransactionCategory(req.user.id, idDto.id);
    }
}
