import {ConflictException, forwardRef, Inject, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {AccountEntity} from "./models/entities/account.entity";
import {UsersService} from "../../security/users/users.service";
import {EncryptionService} from "../../../common/services/encryption.service";
import {EncryptedAccountEntity} from "./models/entities/encrypted-account.entity";
import {BanksService} from "../banks/banks.service";
import {ConfigService} from "@nestjs/config";
import {TransactionsService} from "../transactions/transactions.service";
import {UserEntity} from "../../security/users/models/entities/user.entity";

@Injectable()
export class AccountsService{

    private readonly accountsEncryptionStrength = parseInt(this.configService.get("ACCOUNTS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly banksService: BanksService,
        private readonly configService: ConfigService,
        @Inject(forwardRef(() => TransactionsService))
        private readonly transactionsService: TransactionsService,
    ){}

    async isAccountExists(userId: number, accountId: number): Promise<boolean>{
        return !!await this.prismaService.accounts.findUnique({
            where: {
                id: accountId,
                user_id: userId,
            }
        });
    }

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
                name: this.encryptionService.decryptSymmetric(account.name, user.secret, this.accountsEncryptionStrength),
                amount: parseFloat(this.encryptionService.decryptSymmetric(account.amount, user.secret, this.accountsEncryptionStrength)),
                bank_id: account.bank_id,
                user_id: account.user_id,
            });
        }
        return decryptedAccounts;
    }

    async findById(accountId: number): Promise<AccountEntity>{
        const account: EncryptedAccountEntity = await this.prismaService.accounts.findUnique({
            where: {
                id: accountId,
            }
        });
        if(!account)
            throw new NotFoundException("Account not found");
        const user = await this.usersService.findById(account.user_id);
        return {
            id: account.id,
            name: this.encryptionService.decryptSymmetric(account.name, user.secret, this.accountsEncryptionStrength),
            amount: parseFloat(this.encryptionService.decryptSymmetric(account.amount, user.secret, this.accountsEncryptionStrength)),
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
        const encryptedAmount = this.encryptionService.encryptSymmetric("0", user.secret, this.accountsEncryptionStrength);
        const account: EncryptedAccountEntity = await this.prismaService.accounts.create({
            data: {
                name: this.encryptionService.encryptSymmetric(name, user.secret, this.accountsEncryptionStrength),
                amount: encryptedAmount,
                bank_id: bankId,
                user_id: userId,
            }
        });
        await this.transactionsService.createOtherTransaction("Init", user.secret, account.id, amount, 1);
        return await this.findById(account.id);
    }

    async updateAccountName(userId: number, accountId: number, name: string): Promise<AccountEntity>{
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        const account = await this.findById(accountId);
        if(!account)
            throw new NotFoundException("Account not found");
        const accounts = await this.getAccounts(userId);
        for(const account of accounts)
            if(account.bank_id === account.bank_id && account.name === name)
                throw new ConflictException("Account already exists");
        await this.prismaService.accounts.update({
            where: {
                id: accountId,
            },
            data: {
                name: this.encryptionService.encryptSymmetric(name, user.secret, this.accountsEncryptionStrength),
            }
        });
        return this.findById(accountId);
    }

    async deleteAccount(userId: number, accountId: number){
        const user = await this.usersService.findById(userId);
        if(!user)
            throw new NotFoundException("User not found");
        const account = await this.findById(accountId);
        if(!account)
            throw new NotFoundException("Account not found");
        await this.prismaService.accounts.delete({
            where: {
                id: accountId,
            }
        });
        return account;
    }

    async updateBalance(user: UserEntity, account: AccountEntity, amount: number){
        if(!user)
            throw new NotFoundException("User not found");
        const newAmount = Math.round((account.amount + amount) * 100) / 100;
        await this.prismaService.accounts.update({
            where: {
                id: account.id,
            },
            data: {
                amount: this.encryptionService.encryptSymmetric(newAmount.toString(), user.secret, this.accountsEncryptionStrength),
            }
        });
    }
}
