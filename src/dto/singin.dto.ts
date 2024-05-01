import { IsEmail, IsNumber, IsString, Length, isString, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class dtoSingIn {
    @ApiProperty()
    username: string
    @ApiProperty()
    password: string
}