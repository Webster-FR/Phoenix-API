import {Accounts} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class AccountEntity implements Accounts{
    @ApiProperty()
        name: string;
    @ApiProperty()
        amount: number;
    @ApiProperty()
        bank_id: number;
    @ApiProperty()
        user_id: number;
    @ApiProperty()
        id: number;
}
