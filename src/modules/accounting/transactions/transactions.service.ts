import {BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {EncryptionService} from "../../../common/services/encryption.service";
import {LedgersService} from "../ledgers/ledgers.service";
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../../../users/users.service";
import {InternalTransactionEntity} from "./models/entities/internal-transaction.entity";
import {EncryptedFutureTransactionEntity} from "./models/entities/encrypted-future-transaction.entity";
import {ulid} from "ulid";
import {ExpenseTransactionEntity} from "./models/entities/expense-transaction.entity";
import {AccountsService} from "../accounts/accounts.service";
import {TransactionCategoriesService} from "../transaction-categories/transaction-categories.service";
import {FutureTransactionEntity} from "./models/entities/future-transaction.entity";

@Injectable()
export class TransactionsService{

    private readonly transactionsEncryptionStrength = parseInt(this.configService.get("TRANSACTIONS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: EncryptionService,
        private readonly ledgersService: LedgersService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly transactionCategoriesService: TransactionCategoriesService,
        @Inject(forwardRef(() => AccountsService))
        private readonly accountsService: AccountsService,
    ){}

    decryptTransaction(transaction: Transaction, userSecret: string): Transaction{
        transaction.wording = this.encryptionService.decryptSymmetric(transaction.wording, userSecret, this.transactionsEncryptionStrength);
        return transaction;
    }

    decryptFutureTransaction(transaction: EncryptedFutureTransactionEntity, userSecret: string): FutureTransactionEntity{
        transaction.wording = this.encryptionService.decryptSymmetric(transaction.wording, userSecret, this.transactionsEncryptionStrength);
        const amount = parseFloat(this.encryptionService.decryptSymmetric(transaction.amount, userSecret, this.transactionsEncryptionStrength));
        return new FutureTransactionEntity(transaction, amount);
    }

    async findAmountFromLedgers(creditLedgerId?: number, debitLedgerId?: number, exception: boolean = true): Promise<number>{
        let amount: number = 0;
        if(!creditLedgerId && !debitLedgerId)
            throw new InternalServerErrorException("No credit or debit ledger id provided");
        if(creditLedgerId === debitLedgerId)
            throw new InternalServerErrorException("Credit and debit ledger id are the same");
        if(creditLedgerId){
            const creditLedger = await this.ledgersService.getLedger(creditLedgerId);
            if(creditLedger.debit)
                if(exception)
                    throw new InternalServerErrorException(`Invalid credit ledger with id ${creditLedgerId}`);
                else
                    amount -= creditLedger.debit;
            amount += creditLedger.credit;
        }
        if(debitLedgerId){
            const debitLedger = await this.ledgersService.getLedger(debitLedgerId);
            if(debitLedger.credit)
                if(exception)
                    throw new InternalServerErrorException(`Invalid debit ledger with id ${debitLedgerId}`);
                else
                    amount += debitLedger.credit;
            amount -= debitLedger.debit;
        }
        return amount;
    }

    async processInternalTransaction(accountId: number, transactions: any[]): Promise<Transaction[]>{
        for(const transaction of transactions){
            if(transaction.rectification_ulid)
                continue;
            // Find amount from ledgers
            if(transaction.credit_ledger.account_id === accountId)
                transaction.amount = await this.findAmountFromLedgers(transaction.credit_internal_ledger_id, null);
            else if (transaction.debit_ledger.account_id === accountId)
                transaction.amount = await this.findAmountFromLedgers(null, transaction.debit_internal_ledger_id);
            else
                throw new InternalServerErrorException(`Invalid internal transaction with ulid ${transaction.ulid} (no ledger for account ${accountId})`);
            // Find rectification from transactions
            for(const targetTransaction of transactions){
                if(transaction.ulid === targetTransaction.ulid)
                    continue;
                if(targetTransaction.rectification_ulid === transaction.ulid){
                    if(targetTransaction.credit_ledger.account_id === accountId)
                        transaction.amount += await this.findAmountFromLedgers(targetTransaction.credit_internal_ledger_id, null);
                    else if (targetTransaction.debit_ledger.account_id === accountId)
                        transaction.amount += await this.findAmountFromLedgers(null, targetTransaction.debit_internal_ledger_id);
                    else
                        throw new InternalServerErrorException(`Invalid internal transaction with ulid ${targetTransaction.ulid} (no ledger for account ${accountId})`);
                }
            }
            delete transaction.credit_ledger;
            delete transaction.debit_ledger;
            transaction.amount = Math.round(transaction.amount * 100) / 100;
        }
        return transactions.filter(transaction => !transaction.rectification_ulid);
    }

    async processOtherTransactions(accountId: number, transactions: any[], isCredit: boolean): Promise<Transaction[]>{
        for(const transaction of transactions){
            if(transaction.rectification_ulid)
                continue;
            if(isCredit)
                transaction.amount = await this.findAmountFromLedgers(transaction.internal_ledger_id, null);
            else
                transaction.amount = await this.findAmountFromLedgers(null, transaction.internal_ledger_id);
            for(const targetTransaction of transactions){
                if(transaction.ulid === targetTransaction.ulid)
                    continue;
                if(targetTransaction.rectification_ulid === transaction.ulid){
                    if(isCredit)
                        transaction.amount += await this.findAmountFromLedgers(targetTransaction.internal_ledger_id, null, false);
                    else
                        transaction.amount += await this.findAmountFromLedgers(null, targetTransaction.internal_ledger_id, false);
                }
            }
            delete transaction.internal_ledger;
            transaction.amount = Math.round(transaction.amount * 100) / 100;
        }
        return transactions.filter(transaction => !transaction.rectification_ulid);
    }

    async getProcessedTransactions(userId: number, accountId: number): Promise<Transaction[]>{
        const user = await this.usersService.findById(userId);
        const transactions: Transaction[] = [];
        const internalTransactions: InternalTransactionEntity[] = await this.prismaService.internalTransactions.findMany({
            where: {
                OR: [
                    {
                        debit_ledger: {
                            account_id: accountId,
                        }
                    },
                    {
                        credit_ledger: {
                            account_id: accountId,
                        }
                    },
                ],
            },
            include: {
                debit_ledger: true,
                credit_ledger: true,
            }
        });
        transactions.push(...await this.processInternalTransaction(accountId, internalTransactions));
        const expenseTransactions = await this.prismaService.expenseTransactions.findMany({
            where: {
                internal_ledger: {
                    account_id: accountId,
                }
            },
            include: {
                internal_ledger: true,
            }
        });
        transactions.push(...await this.processOtherTransactions(accountId, expenseTransactions, false));
        const incomeTransactions = await this.prismaService.incomeTransactions.findMany({
            where: {
                internal_ledger: {
                    account_id: accountId,
                }
            },
            include: {
                internal_ledger: true,
            }
        });
        transactions.push(...await this.processOtherTransactions(accountId, incomeTransactions, true));
        for(const transaction of transactions)
            this.decryptTransaction(transaction, user.secret);
        return transactions;
    }

    async getUnprocessedTransactions(userId: number, accountId: number): Promise<FutureTransactionEntity[]>{
        const user = await this.usersService.findById(userId);
        const transactions: EncryptedFutureTransactionEntity[] = await this.prismaService.futureTransactions.findMany({
            where: {
                OR: [
                    {
                        debit_account_id: accountId,
                    },
                    {
                        credit_account_id: accountId,
                    },
                ],
            },
        });
        const decryptedTransactions: FutureTransactionEntity[] = [];
        for(const transaction of transactions)
            decryptedTransactions.push(this.decryptFutureTransaction(transaction, user.secret));
        return decryptedTransactions;
    }

    async createInternalTransaction(wording: string, userSecret: string, fromAccountId: number, toAccountId: number, amount: number, categoryId: number, createdAt?: Date){
        if(amount <= 0)
            throw new BadRequestException("Can't create internal transaction for amount <= 0");
        const fromLedger = await this.ledgersService.createLedger(fromAccountId, -amount);
        const toLedger = await this.ledgersService.createLedger(toAccountId, amount);
        const encryptedWording = this.encryptionService.encryptSymmetric(wording, userSecret, this.transactionsEncryptionStrength);
        const transaction: InternalTransactionEntity = await this.prismaService.internalTransactions.create({
            data: {
                ulid: ulid(),
                wording: encryptedWording,
                category_id: categoryId,
                debit_internal_ledger_id: fromLedger.id,
                credit_internal_ledger_id: toLedger.id,
                created_at: createdAt,
            }
        });
        await this.prismaService.transactionTypes.create({
            data: {
                ulid: transaction.ulid,
                transaction_type: "internal",
            }
        });
        transaction.wording = wording;
        transaction.amount = amount;
        return transaction;
    }

    async createOtherTransaction(wording: string, userSecret: string, accountId: number, amount: number, categoryId: number, createdAt?: Date){
        const ledger = await this.ledgersService.createLedger(accountId, amount);
        const table: any = amount < 0 ? this.prismaService.expenseTransactions : this.prismaService.incomeTransactions;
        const encryptedWording = this.encryptionService.encryptSymmetric(wording, userSecret, this.transactionsEncryptionStrength);
        const transaction: ExpenseTransactionEntity = await table.create({
            data: {
                ulid: ulid(),
                wording: encryptedWording,
                category_id: categoryId,
                internal_ledger_id: ledger.id,
                created_at: createdAt,
            }
        });
        await this.prismaService.transactionTypes.create({
            data: {
                ulid: transaction.ulid,
                transaction_type: amount < 0 ? "expense" : "income",
            }
        });
        transaction.wording = wording;
        transaction.amount = amount;
        return transaction;
    }

    async createTransaction(userId: number, wording: string, categoryId: number, amount: number, fromAccountId?: number, toAccountId?: number, createdAt?: Date): Promise<Transaction | FutureTransactionEntity>{
        const user = await this.usersService.findById(userId);
        if(amount === 0)
            throw new BadRequestException("Can't create transaction for amount 0");
        if(!fromAccountId && !toAccountId)
            throw new BadRequestException("Can't create transaction without from or to account");
        if(fromAccountId === toAccountId)
            throw new BadRequestException("Can't create transaction with the same from and to account");
        if(!await this.transactionCategoriesService.isTransactionCategoryExists(userId, categoryId))
            throw new BadRequestException("Invalid category id");
        if(fromAccountId && !await this.accountsService.isAccountExists(userId, fromAccountId))
            throw new BadRequestException("Invalid from account id");
        if(toAccountId && !await this.accountsService.isAccountExists(userId, toAccountId))
            throw new BadRequestException("Invalid to account id");
        if(createdAt)
            createdAt = new Date(createdAt);
        if(createdAt && createdAt.getTime() > Date.now()){
            // Future transaction
            let transactionType: string;
            if(fromAccountId && toAccountId)
                transactionType = "internal";
            else if(fromAccountId)
                transactionType = "expense";
            else if(toAccountId)
                transactionType = "income";
            else
                throw new BadRequestException("Can't create transaction without from or to account");
            const encryptedWording = this.encryptionService.encryptSymmetric(wording, user.secret, this.transactionsEncryptionStrength);
            const encryptedAmount = this.encryptionService.encryptSymmetric(amount.toString(), user.secret, this.transactionsEncryptionStrength);
            const futureTransaction: EncryptedFutureTransactionEntity = await this.prismaService.futureTransactions.create({
                data: {
                    wording: encryptedWording,
                    category_id: categoryId,
                    amount: encryptedAmount,
                    transaction_type: transactionType,
                    debit_account_id: fromAccountId,
                    credit_account_id: toAccountId,
                    processed_at: createdAt,
                }
            });
            return new FutureTransactionEntity(futureTransaction, amount);
        }else{
            if(fromAccountId && toAccountId)
                return await this.createInternalTransaction(wording, user.secret, fromAccountId, toAccountId, amount, categoryId, createdAt);
            return await this.createOtherTransaction(wording, user.secret, fromAccountId ? fromAccountId : toAccountId, amount, categoryId, createdAt);
        }
    }
}
