import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class TransactionCategoryDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        name: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        icon: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        color: string;
}
