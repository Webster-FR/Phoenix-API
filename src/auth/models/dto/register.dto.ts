import {IsEmail, IsNotEmpty, IsStrongPassword} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RegisterDto{
    @ApiProperty()
    @IsNotEmpty()
        username: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
        email: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
        password: string;
}
