import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class TodolistDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        name: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        color: string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
        icon: string;
}
