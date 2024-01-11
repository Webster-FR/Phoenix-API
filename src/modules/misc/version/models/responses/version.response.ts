import {ApiProperty} from "@nestjs/swagger";

export class VersionResponse{
    @ApiProperty({description: "The version of the application"})
        version: string;
}
