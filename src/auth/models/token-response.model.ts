import {ApiProperty} from "@nestjs/swagger";

export class TokenResponseModel{
    @ApiProperty()
        token: string;

    constructor(token: string){
        this.token = token;
    }
}
