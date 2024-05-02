import { IsEmail, IsIn, IsNumber, IsString, Length, isEnum, isNotEmpty, isString, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class dtoReaction {

    @ApiProperty()
    @IsIn([1, -1], { message: 'must be either 1 or -1' })
    reaction: number;
}