import {ApiProperty} from "@nestjs/swagger";

export class UserCountResponse{
    @ApiProperty()
        count: number;
}
