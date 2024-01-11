import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsNumber} from "class-validator";

export class CreateAccountDto{
    @ApiProperty()
    @IsNotEmpty()
        name: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        amount: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
        bank_id: number;
}
