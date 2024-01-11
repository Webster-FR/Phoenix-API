import {ApiProperty} from "@nestjs/swagger";
import {Transform, Type} from "class-transformer";
import {IsNotEmpty} from "class-validator";

export class DeleteTodoParamDto{
    @ApiProperty({description: "Whether to delete the todos children"})
    @Transform(({value}) => value === "true" || value === true)
        children: boolean;
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
        id: number;
}
