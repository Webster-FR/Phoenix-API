import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsString, MaxLength} from "class-validator";

export class CreateTodoDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
        todo_list_id: number;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MaxLength(150)
        name: string;
    @ApiProperty()
        deadline: Date;
}
