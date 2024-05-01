import { IsEmail, IsNumber, IsString, Length, isString, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class dtoTag {
    @ApiProperty()
    @IsString()
    name: string;
}