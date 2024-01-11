import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {EncryptionService} from "../../../common/services/encryption.service";
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../../security/users/users.service";
import {TransactionCategoryEntity} from "./models/entities/transaction-category.entity";

@Injectable()
export class TransactionCategoriesService{

    private readonly transactionCategoriesEncryptionStrength = parseInt(this.configService.get("TRANSACTION_CATEGORIES_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ){}

    async isTransactionCategoryExists(userId: number, transactionCategoryId: number): Promise<boolean>{
        return !!await this.prismaService.transactionCategories.findUnique({
            where: {
                id: transactionCategoryId,
                OR: [
                    {user_id: userId},
                    {user_id: null},
                ],
            },
        });
    }

    async getTransactionCategories(userId: number): Promise<TransactionCategoryEntity[]>{
        const transactionCategories: TransactionCategoryEntity[] = await this.prismaService.transactionCategories.findMany({
            where: {
                OR: [
                    {user_id: userId},
                    {user_id: null},
                ],
            }
        });
        for(const transactionCategory of transactionCategories)
            transactionCategory.name = this.encryptionService.decryptSymmetric(transactionCategory.name, this.configService.get<string>("SYMMETRIC_ENCRYPTION_KEY"), this.transactionCategoriesEncryptionStrength);
        return transactionCategories;
    }

    async createTransactionCategory(userId: number, name: string, icon: string, color: string): Promise<TransactionCategoryEntity>{
        if(!await this.usersService.isUserExists(userId))
            throw new NotFoundException("This user does not exist.");
        const transactionCategories: TransactionCategoryEntity[] = await this.getTransactionCategories(userId);
        for(const transactionCategory of transactionCategories)
            if(transactionCategory.name === name)
                throw new ConflictException("A transaction category with that name already exists.");
        const transactionCategory: TransactionCategoryEntity = await this.prismaService.transactionCategories.create({
            data: {
                user_id: userId,
                name: this.encryptionService.encryptSymmetric(name, this.configService.get<string>("SYMMETRIC_ENCRYPTION_KEY"), this.transactionCategoriesEncryptionStrength),
                icon,
                color,
            },
        });
        transactionCategory.name = name;
        return transactionCategory;
    }

    async updateTransactionCategory(userId: number, transactionCategoryId: number, name: string, icon: string, color: string): Promise<TransactionCategoryEntity>{
        if(!await this.usersService.isUserExists(userId))
            throw new NotFoundException("This user does not exist.");
        const transactionCategories: TransactionCategoryEntity[] = await this.getTransactionCategories(userId);
        for(const transactionCategory of transactionCategories)
            if(transactionCategory.name === name)
                throw new Error("A transaction category with that name already exists.");
        const transactionCategory: TransactionCategoryEntity = await this.prismaService.transactionCategories.findUnique({
            where: {
                id: transactionCategoryId,
                user_id: userId,
            },
        });
        if(!transactionCategory)
            throw new NotFoundException("This transaction category does not exist for this user.");
        await this.prismaService.transactionCategories.update({
            where: {
                id: transactionCategoryId,
            },
            data: {
                name: this.encryptionService.encryptSymmetric(name, this.configService.get<string>("SYMMETRIC_ENCRYPTION_KEY"), this.transactionCategoriesEncryptionStrength),
                icon,
                color,
            },
        });
        transactionCategory.name = name;
        return transactionCategory;
    }

    async deleteTransactionCategory(userId: number, transactionCategoryId: number): Promise<TransactionCategoryEntity>{
        if(!await this.usersService.isUserExists(userId))
            throw new NotFoundException("This user does not exist.");
        const transactionCategory: TransactionCategoryEntity = await this.prismaService.transactionCategories.findUnique({
            where: {
                id: transactionCategoryId,
                user_id: userId,
            },
        });
        if(!transactionCategory)
            throw new NotFoundException("That transaction category does not exist for this user.");
        await this.prismaService.transactionCategories.delete({
            where: {
                id: transactionCategoryId,
            },
        });
        transactionCategory.name = this.encryptionService.decryptSymmetric(transactionCategory.name, this.configService.get<string>("SYMMETRIC_ENCRYPTION_KEY"), this.transactionCategoriesEncryptionStrength);
        return transactionCategory;
    }
}
