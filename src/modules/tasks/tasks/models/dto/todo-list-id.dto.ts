import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty} from "class-validator";

export class TodoListIdDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsInt()
        todo_list_id: number;
}
