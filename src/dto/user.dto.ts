import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class dtoUser {
    @ApiProperty()
    @IsString()
    @Length(4, 100)
    username: string;

    @ApiProperty({
        example: 'x@y.com',
        required: true
     })
    @IsEmail()
    email: string;

    @ApiProperty()
    @Length(8, 10000)
    @IsNotEmpty()
    @IsString()
    password: string;
    
    @ApiProperty()
    @IsString()
    role: string
}