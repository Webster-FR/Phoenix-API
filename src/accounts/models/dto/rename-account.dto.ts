import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class RenameAccountDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        name: string;
}
