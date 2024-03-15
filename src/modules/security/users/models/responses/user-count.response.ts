import {ApiProperty} from "@nestjs/swagger";

export default class UserCountResponse{
    @ApiProperty()
        count: number;
}
