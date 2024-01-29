import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UpdateTodoDto{
    @ApiProperty()
    @IsNotEmpty()
        name: string;
    @ApiProperty()
        deadline: Date;
    @ApiProperty()
    @IsNotEmpty()
        completed: boolean;
}
