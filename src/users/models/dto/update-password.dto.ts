import {IsStrongPassword} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePasswordDto{
    @ApiProperty({description: "The new password"})
    @IsStrongPassword()
        password: string;
}
