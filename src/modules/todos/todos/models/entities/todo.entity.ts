import {Todos} from "@prisma/client";
import {ApiProperty} from "@nestjs/swagger";

export class TodoEntity implements Todos{
    @ApiProperty()
        id: number;
    @ApiProperty()
        todo_list_id: number;
    @ApiProperty()
        name: string;
    @ApiProperty()
        completed: boolean;
    @ApiProperty()
        deadline: Date;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        updated_at: Date;
}
