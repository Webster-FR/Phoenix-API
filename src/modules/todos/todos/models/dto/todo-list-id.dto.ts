import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class TodoListIdDto{
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
        todo_list_id: number;
}
