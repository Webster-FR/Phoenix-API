import {ApiProperty} from "@nestjs/swagger";
import {Tips} from "@prisma/client";

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
