import {ApiProperty} from "@nestjs/swagger";

export class UpdateUsernameDto{
    @ApiProperty({description: "The new username"})
        username: string;
}
