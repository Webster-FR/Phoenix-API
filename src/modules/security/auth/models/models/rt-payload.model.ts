import {TokenType} from "./token-type";

export class RtPayloadModel{
    user_id: number;
    type: TokenType;
    random: string;

    constructor(userId: number, random: string){
        this.user_id = userId;
        this.type = TokenType.REFRESH;
        this.random = random;
    }
}
