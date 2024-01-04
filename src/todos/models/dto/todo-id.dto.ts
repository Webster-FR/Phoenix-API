import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {Type} from "class-transformer";

export class TodoIdDto{
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
        id: number;
}
