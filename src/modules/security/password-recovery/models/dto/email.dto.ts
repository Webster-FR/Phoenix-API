import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty} from "class-validator";

export class EmailDto{
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
        email: string;
}
