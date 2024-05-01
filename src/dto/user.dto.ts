import { IsEmail, IsNumber, IsString, Length, isString, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class dtoUser {
    @ApiProperty()
    @IsString()
    username: string;

    @ApiProperty({
        example: 'x@y.com',
        required: true
     })
    @IsEmail()
    email: string;

    @ApiProperty()
    @Length(8, 10000)
    @IsString()
    password: string;
    
    @ApiProperty({required: false})
    role: string
}