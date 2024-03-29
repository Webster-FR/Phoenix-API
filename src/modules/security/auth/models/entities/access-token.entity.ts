import {AccessTokens} from "@prisma/client";

export class AccessTokenEntity implements AccessTokens{
    id: number;
    user_id: number;
    sum: string;
    token: string;
    blacklisted: boolean;
    refresh_token_id: number;
    expires: Date;
}
