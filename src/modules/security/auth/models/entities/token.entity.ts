import {Tokens} from "@prisma/client";

export class TokenEntity implements Tokens{
    id: number;
    user_id: number;
    sum: string;
    token: string;
    is_refresh: boolean;
    blacklisted: boolean;
    expires: Date;
}
