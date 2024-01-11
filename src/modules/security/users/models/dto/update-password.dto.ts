import {IsNotEmpty, IsStrongPassword} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePasswordDto{
    @ApiProperty({description: "The new password"})
    @IsNotEmpty()
    @IsStrongPassword()
        password: string;
}
