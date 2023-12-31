import {ApiProperty} from "@nestjs/swagger";

export class RegisterResponse{
    @ApiProperty()
        confirmation_token: string;
}
