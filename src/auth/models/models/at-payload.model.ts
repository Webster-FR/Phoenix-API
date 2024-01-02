import {TokenType} from "./token-type";

export class AtPayloadModel{
    user_id: number;
    type: TokenType;

    constructor(userId: number){
        this.user_id = userId;
        this.type = TokenType.ACCESS;
    }
}
