import {ApiProperty} from "@nestjs/swagger";
import {User} from "@prisma/client";

export class UserEntity implements User{
    @ApiProperty()
        id: number;
    @ApiProperty()
        username: string;
    @ApiProperty()
        password: string;
    @ApiProperty()
        group_id: number;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        updated_at: Date;
}
