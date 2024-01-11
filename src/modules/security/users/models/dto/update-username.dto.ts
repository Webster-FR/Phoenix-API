import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UpdateUsernameDto{
    @ApiProperty({description: "The new username"})
    @IsNotEmpty()
        username: string;
}
