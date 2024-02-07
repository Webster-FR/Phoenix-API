import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class TodolistDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
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
