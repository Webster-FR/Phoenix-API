import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, MaxLength} from "class-validator";

export class UpdateTodoDto{
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(150)
        name: string;
    @ApiProperty()
        deadline: Date;
    @ApiProperty()
    @IsNotEmpty()
        completed: boolean;
}
