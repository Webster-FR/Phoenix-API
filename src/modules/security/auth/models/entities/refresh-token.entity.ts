import {RefreshToken} from "@prisma/client";

export class RefreshTokenEntity implements RefreshToken{
    id: number;
    user_id: number;
    sum: string;
    token: string;
    blacklisted: boolean;
    expires: Date;
}
