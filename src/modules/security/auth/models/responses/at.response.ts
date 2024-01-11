import {ApiProperty} from "@nestjs/swagger";

export class AtResponse{
    @ApiProperty()
        accessToken: string;

    constructor(accessToken: string){
        this.accessToken = accessToken;
    }
}
