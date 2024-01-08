import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsNotEmpty} from "class-validator";

export class CreateTodoDto{
    @ApiProperty()
    @IsNotEmpty()
        name: string;
    @ApiProperty()
    @IsDateString()
        deadline: Date;
    @ApiProperty()
        parent_id: number;
    @ApiProperty()
        frequency: string;
    @ApiProperty()
    @IsNotEmpty()
        icon: string;
    @ApiProperty()
    @IsNotEmpty()
        color: string;
}
