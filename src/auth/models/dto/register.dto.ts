import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsStrongPassword} from "class-validator";

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
