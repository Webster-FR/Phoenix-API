import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";
import {IsNotEmpty} from "class-validator";

export class UpdateCompletedDto{
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({value}) => value === "true" || value === true)
        completed: boolean;
}
