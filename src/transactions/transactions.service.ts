import {Injectable} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {EncryptionService} from "../services/encryption.service";
import {LedgersService} from "../ledgers/ledgers.service";
import {ConfigService} from "@nestjs/config";
import {UsersService} from "../users/users.service";

@Injectable()
export class TransactionsService{

    constructor(
        private readonly prismaService: PrismaService,
        private readonly encryptionService: EncryptionService,
        private readonly ledgersService: LedgersService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
    ){}

    decryptTransaction(transaction: Transaction, userSecret: string): Transaction{
        transaction.wording = this.encryptionService.decryptSymmetric(transaction.wording, userSecret);
        return transaction;
    }

    async getProcessedTransactions(userId: number, accountId: number): Promise<Transaction[]>{
        const user = await this.usersService.findById(userId);
        const transactions: Transaction[] = [];
        const internalTransactions = await this.prismaService.internalTransactions.findMany({
            where: {
                account_id: accountId,
            }
        });
        transactions.push(...internalTransactions);
        const expenseTransactions = await this.prismaService.expenseTransactions.findMany({
            where: {
                account_id: accountId,
            }
        });
        transactions.push(...expenseTransactions);
        const incomeTransactions = await this.prismaService.incomeTransactions.findMany({
            where: {
                account_id: accountId,
            }
        });
        transactions.push(...incomeTransactions);
        for(const transaction of transactions)
            this.decryptTransaction(transaction, user.secret);
        return transactions;
    }

}
