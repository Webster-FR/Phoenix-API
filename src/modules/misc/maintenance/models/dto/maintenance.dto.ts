import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class MaintenanceDto{
    @ApiProperty()
        message: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        maintenance_secret: string;
}
