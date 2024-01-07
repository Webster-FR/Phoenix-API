import {IncomeTransactions} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class IncomeTransactionEntity implements IncomeTransactions, Transaction{
    @ApiProperty()
        ulid: string;
    @ApiProperty()
        amount: number;
    @ApiProperty()
        wording: string;
    @ApiProperty()
        category_id: number;
    @ApiProperty()
        account_id: number;
    @ApiProperty()
        internal_ledger_id: number;
    @ApiProperty()
        rectification_ulid: string;
    @ApiProperty()
        created_at: Date;
}
