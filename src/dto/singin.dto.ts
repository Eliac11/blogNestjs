import { IsEmail, IsNumber, IsString, Length, isString, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class dtoSingIn {
    @ApiProperty()
    @IsString()
    username: string

    @ApiProperty()
    @IsString()
    password: string
}