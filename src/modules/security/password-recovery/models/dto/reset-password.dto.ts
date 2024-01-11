import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, Matches} from "class-validator";

export class ResetPasswordDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        recovery_code: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
        new_password: string;
}
