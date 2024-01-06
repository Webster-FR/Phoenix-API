import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {AccountEntity} from "./models/entities/account.entity";
import {UsersService} from "../users/users.service";
import {EncryptionService} from "../services/encryption.service";
import {EncryptedAccountEntity} from "./models/entities/encrypted-account.entity";
import {BanksService} from "../banks/banks.service";

@Injectable()
export class AccountsService{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly banksService: BanksService,
    ){}

    async getAccounts(userId: number): Promise<AccountEntity[]>{
        const user = await this.usersService.findById(userId);
        const accounts: EncryptedAccountEntity[] = await this.prismaService.accounts.findMany({
            where: {
                user_id: userId,
            }
        });
        const decryptedAccounts: AccountEntity[] = [];
        for(const account of accounts){
            decryptedAccounts.push({
                id: account.id,
                name: this.encryptionService.decryptSymmetric(account.name, user.secret),
                amount: parseFloat(this.encryptionService.decryptSymmetric(account.amount, user.secret)),
                bank_id: account.bank_id,
                user_id: account.user_id,
            });
        }
        return decryptedAccounts;
    }

    async findById(id: number): Promise<AccountEntity>{
        const account: EncryptedAccountEntity = await this.prismaService.accounts.findUnique({
            where: {
                id: id,
            }
        });
        const user = await this.usersService.findById(account.user_id);
        return {
            id: account.id,
            name: this.encryptionService.decryptSymmetric(account.name, user.secret),
            amount: parseFloat(this.encryptionService.decryptSymmetric(account.amount, user.secret)),
            bank_id: account.bank_id,
            user_id: account.user_id,
        };
    }

    async createAccount(userId: number, name: string, amount: number, bankId: number): Promise<AccountEntity>{
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        const bank = await this.banksService.findOne(userId, bankId);
        if(!bank)
            throw new NotFoundException("User or default bank not found");
        const accounts = await this.getAccounts(userId);
        for(const account of accounts)
            if(account.bank_id === bankId && account.name === name)
                throw new ConflictException("Account already exists");
        const encryptedAmount = this.encryptionService.encryptSymmetric(amount.toString(), user.secret);
        const account: EncryptedAccountEntity = await this.prismaService.accounts.create({
            data: {
                name: this.encryptionService.encryptSymmetric(name, user.secret),
                amount: encryptedAmount,
                bank_id: bankId,
                user_id: userId,
            }
        });
        return await this.findById(account.id);
    }
}
