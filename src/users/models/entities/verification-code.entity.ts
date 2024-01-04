import {VerificationCodes} from "@prisma/client";

export class VerificationCodeEntity implements VerificationCodes{
    id: number;
    code: string;
    iat: Date;
}
