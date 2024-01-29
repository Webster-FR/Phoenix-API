import {RefreshTokens} from "@prisma/client";

export class RefreshTokenEntity implements RefreshTokens{
    id: number;
    user_id: number;
    sum: string;
    token: string;
    blacklisted: boolean;
    expires: Date;
}
