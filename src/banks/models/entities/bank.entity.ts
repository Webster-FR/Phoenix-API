import {Banks} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class BankEntity implements Banks{
    @ApiProperty()
        id: number;
    @ApiProperty()
        name: string;
    @ApiProperty()
        user_id: number;
}
