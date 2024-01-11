import {ApiProperty} from "@nestjs/swagger";

export class AtDto{
    @ApiProperty()
        access_token: string;
}
