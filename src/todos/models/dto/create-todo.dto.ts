import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class CreateTodoDto{
    @ApiProperty()
    @IsNotEmpty()
        name: string;
    @ApiProperty()
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
