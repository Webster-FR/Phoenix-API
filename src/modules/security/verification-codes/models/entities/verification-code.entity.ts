import {VerificationCodes} from "@prisma/client";

export class VerificationCodeEntity implements VerificationCodes{
    id: number;
    user_id: number;
    code: string;
    iat: Date;
}
