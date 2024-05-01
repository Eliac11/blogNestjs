import { IsEmail, IsNumber, IsString, Length, isString, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class dtoCategory {
    @ApiProperty()
    @IsString()
    name: string;
}