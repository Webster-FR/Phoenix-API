import {ApiProperty} from "@nestjs/swagger";

export class CtResponse{
    @ApiProperty()
        confirmation_token: string;

    constructor(confirmation_token: string){
        this.confirmation_token = confirmation_token;
    }
}
