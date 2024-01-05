import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, Matches} from "class-validator";

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
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        password: string;
}
