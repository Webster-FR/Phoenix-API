import {ApiProperty} from "@nestjs/swagger";

export class AccountEntity{
    @ApiProperty()
        id: number;
    @ApiProperty()
        name: string;
    @ApiProperty()
        amount: number;
    @ApiProperty()
        bank_id: number;
    @ApiProperty()
        user_id: number;
}
