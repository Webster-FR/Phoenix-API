import {FutureTransactions} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class EncryptedFutureTransactionEntity implements FutureTransactions{
    @ApiProperty()
        id: number;
    @ApiProperty()
        amount: string;
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
}
