import { IsArray, IsEmail, IsNumber, IsString, Length, isString, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { dtoCategory } from "./category.dto";
import { dtoTag } from "./tag.dto";
export class dtoPost {

    @ApiProperty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsString()
    content: string;

    @ApiProperty({ required: false })
    @IsArray()
    categories: Array<dtoCategory>;

    @ApiProperty({ required: false })
    @IsArray()
    tags: Array<dtoTag>;
}