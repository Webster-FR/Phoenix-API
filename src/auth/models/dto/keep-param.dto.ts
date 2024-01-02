import {ApiProperty} from "@nestjs/swagger";

export class KeepParamDto{
    @ApiProperty({description: "Whether to keep the user logged in after registration"})
        keep: boolean;
}
