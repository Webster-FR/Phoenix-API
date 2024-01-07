import {Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, UseGuards} from "@nestjs/common";
import {TransactionCategoriesService} from "./transaction-categories.service";
import {AtGuard} from "../auth/guards/at.guard";
import {ApiBearerAuth, ApiResponse, ApiTags} from "@nestjs/swagger";
import {TransactionCategoryEntity} from "./models/entities/transaction-category.entity";
import {TransactionCategoryDto} from "./models/dto/transaction-category.dto";
import {IdDto} from "../models/dto/id.dto";
import {MaintenanceGuard} from "../maintenance/guards/maintenance.guard";

@Controller("transaction/categories")
@UseGuards(MaintenanceGuard)
@ApiTags("Transaction Categories")
export class TransactionCategoriesController{

    constructor(
        private readonly transactionCategoriesService: TransactionCategoriesService
    ){}

    @Get("/categories")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Returns all transaction categories"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Missing or invalid access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    async getTransactionCategories(@Req() req: any): Promise<TransactionCategoryEntity[]>{
        return this.transactionCategoriesService.getTransactionCategories(req.user.id);
    }

    @Post("/categories")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.CREATED, description: "Creates a new transaction category"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Missing or invalid access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid transaction category data"})
    async createTransactionCategory(@Req() req: any, @Body() transactionCategoryDto: TransactionCategoryDto): Promise<TransactionCategoryEntity>{
        return this.transactionCategoriesService.createTransactionCategory(req.user.id, transactionCategoryDto.name, transactionCategoryDto.icon, transactionCategoryDto.color);
    }

    @Put("/categories/:id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Updates a transaction category"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Missing or invalid access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid transaction category data"})
    async updateTransactionCategory(@Req() req: any, @Param() idDto: IdDto, @Body() transactionCategoryDto: TransactionCategoryDto): Promise<TransactionCategoryEntity>{
        return this.transactionCategoriesService.updateTransactionCategory(req.user.id, idDto.id, transactionCategoryDto.name, transactionCategoryDto.icon, transactionCategoryDto.color);
    }

    @Delete("/categories/:id")
    @UseGuards(AtGuard)
    @ApiBearerAuth()
    @ApiResponse({status: HttpStatus.OK, description: "Deletes a transaction category"})
    @ApiResponse({status: HttpStatus.UNAUTHORIZED, description: "Missing or invalid access token"})
    @ApiResponse({status: HttpStatus.NOT_FOUND, description: "User not found"})
    @ApiResponse({status: HttpStatus.BAD_REQUEST, description: "Invalid transaction category id"})
    async deleteTransactionCategory(@Req() req: any, @Param() idDto: IdDto): Promise<TransactionCategoryEntity>{
        return this.transactionCategoriesService.deleteTransactionCategory(req.user.id, idDto.id);
    }
}
