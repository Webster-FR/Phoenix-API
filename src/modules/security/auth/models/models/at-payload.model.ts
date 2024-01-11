import {TokenType} from "./token-type";

export class AtPayloadModel{
    user_id: number;
    type: TokenType;
    random: string;

    constructor(userId: number, random: string){
        this.user_id = userId;
        this.type = TokenType.ACCESS;
        this.random = random;
    }
}
