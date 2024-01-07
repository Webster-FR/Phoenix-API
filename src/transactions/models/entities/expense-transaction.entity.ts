import {IncomeTransactions} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class ExpenseTransactionEntity implements IncomeTransactions, Transaction{
    @ApiProperty()
        ulid: string;
    @ApiProperty()
        wording: string;
    @ApiProperty()
        category_id: number;
    @ApiProperty()
        internal_ledger_id: number;
    @ApiProperty()
        rectification_ulid: string;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        amount?: number;
}
