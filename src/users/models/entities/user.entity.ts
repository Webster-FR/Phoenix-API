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
        password: string;
    @ApiProperty()
        secret: string;
    @ApiProperty()
        verification_code_id: number;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        updated_at: Date;
}
