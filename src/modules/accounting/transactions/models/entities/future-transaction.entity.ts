import {ApiProperty} from "@nestjs/swagger";
import {EncryptedFutureTransactionEntity} from "./encrypted-future-transaction.entity";

export class FutureTransactionEntity{
    @ApiProperty()
        id: number;
    @ApiProperty()
        amount: number;
    @ApiProperty()
        wording: string;
    @ApiProperty()
        category_id: number;
    @ApiProperty()
        debit_account_id: number;
    @ApiProperty()
        credit_account_id: number;
    @ApiProperty()
        transaction_type: string;
    @ApiProperty()
        processed_at: Date;

    constructor(encryptedFutureTransaction: EncryptedFutureTransactionEntity, amount: number){
        this.id = encryptedFutureTransaction.id;
        this.amount = amount;
        this.wording = encryptedFutureTransaction.wording;
        this.category_id = encryptedFutureTransaction.category_id;
        this.debit_account_id = encryptedFutureTransaction.debit_account_id;
        this.credit_account_id = encryptedFutureTransaction.credit_account_id;
        this.transaction_type = encryptedFutureTransaction.transaction_type;
        this.processed_at = encryptedFutureTransaction.processed_at;
    }
}
