import {PasswordRecoveryCodes} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class RecoveryCodeEntity implements PasswordRecoveryCodes{
    @ApiProperty()
        id: number;
    @ApiProperty()
        user_id: number;
    @ApiProperty()
        code: string;
    @ApiProperty()
        iat: Date;
}
