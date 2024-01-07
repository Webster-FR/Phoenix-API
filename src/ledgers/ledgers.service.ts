import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../services/prisma.service";
import {UsersService} from "../users/users.service";
import {LedgerEntity} from "./models/entities/ledger.entity";
import {EncryptionService} from "../services/encryption.service";
import {EncryptedLedgerEntity} from "./models/entities/encrypted-ledger.entity";
import {ConfigService} from "@nestjs/config";
import {AccountEntity} from "../accounts/models/entities/account.entity";
import {EncryptedAccountEntity} from "../accounts/models/entities/encrypted-account.entity";

@Injectable()
export class LedgersService{

    private readonly ledgersEncryptionStrength = parseInt(this.configService.get("LEDGERS_ENCRYPTION_STRENGTH"));
    private readonly accountsEncryptionStrength = parseInt(this.configService.get("ACCOUNTS_ENCRYPTION_STRENGTH"));

    constructor(
        private readonly prismaService: PrismaService,
        private readonly usersService: UsersService,
        private readonly encryptionService: EncryptionService,
        private readonly configService: ConfigService,
    ){}

    async findAccountById(accountId: number): Promise<AccountEntity>{
        // noinspection DuplicatedCode
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

    async createLedger(accountId: number, amount: number): Promise<LedgerEntity>{
        if(amount === 0)
            throw new BadRequestException("Amount cannot be zero");
        const account = await this.findAccountById(accountId);
        const user = await this.usersService.findById(account.user_id);
        const credit = amount > 0 ? amount : null;
        const debit = amount < 0 ? amount : null;
        let encryptedCredit = null;
        let encryptedDebit = null;
        if(credit)
            encryptedCredit = this.encryptionService.encryptSymmetric(credit.toString(), user.secret, this.ledgersEncryptionStrength);
        if(debit)
            encryptedDebit = this.encryptionService.encryptSymmetric(debit.toString(), user.secret, this.ledgersEncryptionStrength);
        const ledger: EncryptedLedgerEntity = await this.prismaService.internalLedger.create({
            data: {
                credit: encryptedCredit,
                debit: encryptedDebit,
                account_id: accountId,
            }
        });
        const ledgerEntity = new LedgerEntity();
        ledgerEntity.id = ledger.id;
        ledgerEntity.account_id = ledger.account_id;
        ledgerEntity.credit = credit;
        ledgerEntity.debit = debit;
        ledgerEntity.created_at = ledger.created_at;
        return ledgerEntity;
    }

    async getLedgers(accountId: number): Promise<LedgerEntity[]>{
        const account = await this.findAccountById(accountId);
        const user = await this.usersService.findById(account.user_id);
        const ledgers: EncryptedLedgerEntity[] = await this.prismaService.internalLedger.findMany({
            where: {
                account_id: accountId
            }
        });
        const ledgerEntities: LedgerEntity[] = [];
        for(const ledger of ledgers){
            const ledgerEntity = new LedgerEntity();
            ledgerEntity.id = ledger.id;
            ledgerEntity.account_id = ledger.account_id;
            ledgerEntity.credit = ledger.credit ? parseFloat(this.encryptionService.decryptSymmetric(ledger.credit, user.secret, this.ledgersEncryptionStrength)) : null;
            ledgerEntity.debit = ledger.debit ? parseFloat(this.encryptionService.decryptSymmetric(ledger.debit, user.secret, this.ledgersEncryptionStrength)) : null;
            ledgerEntity.created_at = ledger.created_at;
            ledgerEntities.push(ledgerEntity);
        }
        return ledgerEntities;
    }

    async getLedger(ledgerId: number): Promise<LedgerEntity>{
        const ledger: EncryptedLedgerEntity = await this.prismaService.internalLedger.findUnique({
            where: {
                id: ledgerId
            }
        });
        const account = await this.findAccountById(ledger.account_id);
        const user = await this.usersService.findById(account.user_id);
        const ledgerEntity = new LedgerEntity();
        ledgerEntity.id = ledger.id;
        ledgerEntity.account_id = ledger.account_id;
        ledgerEntity.credit = ledger.credit ? parseFloat(this.encryptionService.decryptSymmetric(ledger.credit, user.secret, this.ledgersEncryptionStrength)) : null;
        ledgerEntity.debit = ledger.debit ? parseFloat(this.encryptionService.decryptSymmetric(ledger.debit, user.secret, this.ledgersEncryptionStrength)) : null;
        ledgerEntity.created_at = ledger.created_at;
        return ledgerEntity;
    }
}
