import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class BankNameDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        name: string;
}
