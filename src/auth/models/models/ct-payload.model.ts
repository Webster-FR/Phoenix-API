import {TokenType} from "./token-type";

export class CtPayloadModel{
    user_id: number;
    type: TokenType;
    keep: boolean;

    constructor(userId: number, keepLoggedIn: boolean){
        this.user_id = userId;
        this.type = TokenType.CONFIRMATION;
        this.keep = keepLoggedIn;
    }
}
