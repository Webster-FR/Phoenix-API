import {ApiProperty} from "@nestjs/swagger";

export class ConfirmAccountResponse{
    @ApiProperty()
        accessToken: string;
}
