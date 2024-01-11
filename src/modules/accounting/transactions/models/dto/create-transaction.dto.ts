import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsInt, IsNotEmpty, IsNumber, IsString} from "class-validator";

export default class CreateTransactionDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        wording: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
        category_id: number;
    @ApiProperty()
    @IsDateString()
        created_at?: Date;
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
        amount: number;
    @ApiProperty()
    @IsInt()
        from_account_id?: number;
    @ApiProperty()
    @IsInt()
        to_account_id?: number;
}
