import {Injectable, Logger} from "@nestjs/common";
import {PrismaService} from "../../../common/services/prisma.service";
import {UserEntity} from "../users/models/entities/user.entity";
import {UsersService} from "../users/users.service";
import {EncryptionService} from "../../../common/services/encryption.service";
import {TodosService} from "../../todos/todos/todos.service";
import {AccountsService} from "../../accounting/accounts/accounts.service";
import {LedgersService} from "../../accounting/ledgers/ledgers.service";
import {LedgerEntity} from "../../accounting/ledgers/models/entities/ledger.entity";
import {EncryptedAccountEntity} from "../../accounting/accounts/models/entities/encrypted-account.entity";
import {TodoListsService} from "../../todos/todo-lists/todo-lists.service";
import {Prisma} from "@prisma/client/extension";


@Injectable()
export class SecretsService{

    private readonly accountsEncryptionStrength = parseInt(process.env.ACCOUNTS_ENCRYPTION_STRENGTH);
    private readonly todosEncryptionStrength = parseInt(process.env.TODOS_ENCRYPTION_STRENGTH);
    private readonly ledgersEncryptionStrength = parseInt(process.env.LEDGERS_ENCRYPTION_STRENGTH);
    private readonly logger: Logger = new Logger(SecretsService.name);

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly todosService: TodosService,
        private readonly accountsService: AccountsService,
        private readonly ledgersService: LedgersService,
        private readonly todolistsService: TodoListsService,
    ){}

    async runSecretsRotation(){
        const users: UserEntity[] = await this.usersService.findAll();
        for(const user of users){
            const start = Date.now();
            const secret = user.secret;
            const newSecret = this.encryptionService.generateSecret();
            // await this.rotateLedgers(user, secret, newSecret);
            // await this.rotateAccounts(user, secret, newSecret);
            await this.prismaService.$transaction(async(tx: Prisma.TransactionClient) => {
                await this.todolistsService.rotateEncryptionKey(tx, user, secret, newSecret);
                await this.todosService.rotateEncryptionKey(tx, user, secret, newSecret);
                await this.usersService.setUserSecret(tx, user, newSecret);
            });
            const stop = Date.now();
            this.logger.log(`Rotated user ${user.id} in ${stop - start}ms`);
        }
    }

    // async rotateAccounts(user: UserEntity, secret: string, newSecret: string){
    //     const accounts = await this.accountsService.getAccounts(user);
    //     for(const account of accounts){
    //         const encryptedName = this.encryptionService.encryptSymmetric(account.name, newSecret, this.accountsEncryptionStrength);
    //         const encryptedAmount = this.encryptionService.encryptSymmetric(account.amount.toString(), newSecret, this.accountsEncryptionStrength);
    //         await this.prismaService.accounts.update({
    //             where: {
    //                 id: account.id
    //             },
    //             data: {
    //                 name: encryptedName,
    //                 amount: encryptedAmount,
    //             },
    //         });
    //     }
    // }
    //
    // async rotateLedgers(user: UserEntity, secret: string, newSecret: string){
    //     const accounts: EncryptedAccountEntity[] = await this.prismaService.accounts.findMany({
    //         where: {
    //             user_id: user.id
    //         }
    //     });
    //     for(const account of accounts){
    //         const ledgers: LedgerEntity[] = await this.ledgersService.getLedgers(account.id);
    //         for(const ledger of ledgers){
    //             const encryptedCredit = ledger.credit ? this.encryptionService.encryptSymmetric(ledger.credit.toString(), newSecret, this.ledgersEncryptionStrength) : null;
    //             const encryptedDebit = ledger.debit ? this.encryptionService.encryptSymmetric(ledger.debit.toString(), newSecret, this.ledgersEncryptionStrength) : null;
    //             await this.prismaService.internalLedger.update({
    //                 where: {
    //                     id: ledger.id
    //                 },
    //                 data: {
    //                     credit: encryptedCredit,
    //                     debit: encryptedDebit,
    //                 },
    //             });
    //         }
    //     }
    // }
}
