import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class DisableMaintenanceDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
        maintenance_secret: string;
}
