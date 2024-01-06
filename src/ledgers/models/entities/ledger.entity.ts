import {ApiProperty} from "@nestjs/swagger";

export class LedgerEntity{
    @ApiProperty()
        id: number;
    @ApiProperty()
        account_id: number;
    @ApiProperty()
        debit: number;
    @ApiProperty()
        credit: number;
    @ApiProperty()
        created_at: Date;
}
