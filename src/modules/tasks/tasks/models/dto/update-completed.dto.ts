import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";
import {Transform} from "class-transformer";

export class UpdateCompletedDto{
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({value}) => value === "true" || value === true)
        completed: boolean;
}
