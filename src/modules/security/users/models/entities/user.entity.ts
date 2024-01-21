import {User} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class UserEntity implements User{
    @ApiProperty()
        id: number;
    @ApiProperty()
        username: string;
    @ApiProperty()
        email: string;
    @ApiProperty()
        email_sum: string;
    @ApiProperty()
        password: string;
    @ApiProperty()
        secret: string;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        updated_at: Date;
}
