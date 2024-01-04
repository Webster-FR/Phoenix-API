import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UpdateParentDto{
    @ApiProperty()
    @IsNotEmpty()
        parent_id: number;
}
