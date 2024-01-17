import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsString} from "class-validator";

export class CreateTodoDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
        todo_list_id: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        name: string;
    @ApiProperty()
        deadline: Date;
}
