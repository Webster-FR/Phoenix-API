import {TodoLists} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class TodoListEntity implements TodoLists{
    @ApiProperty()
        id: number;
    @ApiProperty()
        user_id: number;
    @ApiProperty()
        name: string;
    @ApiProperty()
        icon: string;
    @ApiProperty()
        color: string;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        updated_at: Date;
}
