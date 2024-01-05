import {ApiProperty} from "@nestjs/swagger";
import {Todos} from "@prisma/client";

export class TodoEntity implements Todos{
    @ApiProperty()
        id: number;
    @ApiProperty()
        user_id: number;
    @ApiProperty()
        name: string;
    @ApiProperty()
        completed: boolean;
    @ApiProperty()
        deadline: Date;
    @ApiProperty()
        parent_id: number;
    @ApiProperty()
        frequency: string;
    @ApiProperty()
        icon: string;
    @ApiProperty()
        color: string;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        updated_at: Date;
}
