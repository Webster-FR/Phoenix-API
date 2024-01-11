import {Tips} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class TipEntity implements Tips{
    @ApiProperty()
        id: number;
    @ApiProperty()
        tips: string;
    @ApiProperty()
        author: string;
    @ApiProperty()
        order: number;
}
