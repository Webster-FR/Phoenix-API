import {ApiProperty} from "@nestjs/swagger";

export class RtDto{
    @ApiProperty()
        refresh_token: string;
}
