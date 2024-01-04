import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UpdateTodoDto{
    @ApiProperty()
    @IsNotEmpty()
        name: string;
    @ApiProperty()
    @IsNotEmpty()
        deadline: Date;
    @ApiProperty()
        frequency: string;
    @ApiProperty()
    @IsNotEmpty()
        completed: boolean;
    @ApiProperty()
    @IsNotEmpty()
        icon: string;
    @ApiProperty()
    @IsNotEmpty()
        color: string;
}
