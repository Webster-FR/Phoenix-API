import {Accounts} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class EncryptedAccountEntity implements Accounts{
    @ApiProperty()
        name: string;
    @ApiProperty()
        amount: string;
    @ApiProperty()
        bank_id: number;
    @ApiProperty()
        user_id: number;
    @ApiProperty()
        id: number;
}
