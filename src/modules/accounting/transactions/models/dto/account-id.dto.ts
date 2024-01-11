import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class AccountIdDto{
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
        account_id: number;
}
