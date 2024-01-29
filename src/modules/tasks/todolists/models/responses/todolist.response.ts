import {ApiProperty} from "@nestjs/swagger";
import {TodoListEntity} from "../entities/todolist.entity";

export class TodoListResponse implements TodoListEntity{
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
        todo_count: number;
    @ApiProperty()
        completed_todo_count: number;
    @ApiProperty()
        created_at: Date;
    @ApiProperty()
        updated_at: Date;
}
