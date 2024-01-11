import {IsNotEmpty, IsString, IsStrongPassword} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePasswordDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        old_password: string;
    @ApiProperty({description: "The new password"})
    @IsNotEmpty()
    @IsStrongPassword()
        password: string;
}
