import * as jwt from "jsonwebtoken";
import {ApiProperty} from "@nestjs/swagger";

export class JwtPayloadModel implements jwt.JwtPayload{
    @ApiProperty()
        id: number;
}
