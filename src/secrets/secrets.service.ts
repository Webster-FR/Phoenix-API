import {Injectable, Logger} from "@nestjs/common";
import {PrismaService} from "../common/services/prisma.service";
import {UserEntity} from "../users/models/entities/user.entity";
import {UsersService} from "../users/users.service";
import {EncryptionService} from "../common/services/encryption.service";
import {TodosService} from "../modules/todos/todos.service";
import {AccountsService} from "../modules/accounting/accounts/accounts.service";
import {LedgersService} from "../ledgers/ledgers.service";
import {LedgerEntity} from "../ledgers/models/entities/ledger.entity";
import {EncryptedAccountEntity} from "../modules/accounting/accounts/models/entities/encrypted-account.entity";


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
    ){}

    async runSecretsRotation(){
        const users: UserEntity[] = await this.usersService.findAll();
        for(const user of users){
            const secret = user.secret;
            const newSecret = this.encryptionService.generateSecret();
            this.logger.debug(`Rotating ledgers for user ${user.id}`);
            await this.rotateLedgers(user, secret, newSecret);
            this.logger.debug(`Rotating accounts for user ${user.id}`);
            await this.rotateAccounts(user, secret, newSecret);
            this.logger.debug(`Rotating todos for user ${user.id}`);
            await this.rotateTodos(user, secret, newSecret);
            this.logger.debug(`Rotating user ${user.id}`);
            await this.usersService.setUserSecret(user, newSecret);
        }
    }

    async rotateTodos(user: UserEntity, secret: string, newSecret: string){
        const todos = await this.todosService.getTodos(user);
        for(const todo of todos){
            const encryptedName = this.encryptionService.encryptSymmetric(todo.name, newSecret, this.todosEncryptionStrength);
            await this.prismaService.todos.update({
                where: {
                    id: todo.id
                },
                data: {
                    name: encryptedName
                },
            });
        }
    }

    async rotateAccounts(user: UserEntity, secret: string, newSecret: string){
        const accounts = await this.accountsService.getAccounts(user.id);
        for(const account of accounts){
            const encryptedName = this.encryptionService.encryptSymmetric(account.name, newSecret, this.accountsEncryptionStrength);
            const encryptedAmount = this.encryptionService.encryptSymmetric(account.amount.toString(), newSecret, this.accountsEncryptionStrength);
            await this.prismaService.accounts.update({
                where: {
                    id: account.id
                },
                data: {
                    name: encryptedName,
                    amount: encryptedAmount,
                },
            });
        }
    }

    async rotateLedgers(user: UserEntity, secret: string, newSecret: string){
        const accounts: EncryptedAccountEntity[] = await this.prismaService.accounts.findMany({
            where: {
                user_id: user.id
            }
        });
        for(const account of accounts){
            const ledgers: LedgerEntity[] = await this.ledgersService.getLedgers(account.id);
            for(const ledger of ledgers){
                const encryptedCredit = ledger.credit ? this.encryptionService.encryptSymmetric(ledger.credit.toString(), newSecret, this.ledgersEncryptionStrength) : null;
                const encryptedDebit = ledger.debit ? this.encryptionService.encryptSymmetric(ledger.debit.toString(), newSecret, this.ledgersEncryptionStrength) : null;
                await this.prismaService.internalLedger.update({
                    where: {
                        id: ledger.id
                    },
                    data: {
                        credit: encryptedCredit,
                        debit: encryptedDebit,
                    },
                });
            }
        }
    }
}
