import { IsEmail, IsNumber, IsString, Length, isString, minLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class dtoProfile {

        @ApiProperty({required: false})
        bio: string;

        @ApiProperty({required: false})
        avatar: string;
}
