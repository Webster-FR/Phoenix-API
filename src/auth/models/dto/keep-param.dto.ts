import {ApiProperty} from "@nestjs/swagger";
import {Transform} from "class-transformer";

export class KeepParamDto{
    @ApiProperty({description: "Whether to keep the user logged in after registration"})
    @Transform(({value}) => value === "true" || value === true)
        keep: boolean;
}
