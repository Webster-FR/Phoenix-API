import {InternalLedger} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class EncryptedLedgerEntity implements InternalLedger{
    @ApiProperty()
        id: number;
    @ApiProperty()
        account_id: number;
    @ApiProperty()
        debit: string;
    @ApiProperty()
        credit: string;
    @ApiProperty()
        created_at: Date;
}
