import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class MaintenanceDto{
    @ApiProperty()
    @IsNotEmpty()
    @Transform(({value}) => value === "true" || value === true)
        maintenance_enable: boolean;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        maintenance_secret: string;
}
