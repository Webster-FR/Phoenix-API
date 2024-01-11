import {ApiProperty} from "@nestjs/swagger";

export class AtRtResponse{
    @ApiProperty()
        access_token: string;
    @ApiProperty({nullable: true})
        refresh_token?: string;

    constructor(accessToken: string, refreshToken?: string){
        this.access_token = accessToken;
        this.refresh_token = refreshToken;
    }
}
