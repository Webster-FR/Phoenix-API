import {UserEntity} from "../entities/user.entity";
import {ApiProperty} from "@nestjs/swagger";

export class UserResponse{
    @ApiProperty()
        id: number;
    @ApiProperty()
        username: string;
    @ApiProperty()
        email: string;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        updated_at: Date;

    constructor(user: UserEntity){
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
    }
}
