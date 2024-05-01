import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { dtoUser } from 'src/dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }


    @ApiTags("Users")
    @Get("")
    getUsers() {
        return this.userService.getUsers()
    }
    @ApiTags("Users")
    @Get("/:username")
    getUser(@Param("username") username: string) {
        return this.userService.findOne(username)
    }

    @ApiTags("Auth")
    @UsePipes(new ValidationPipe())
    @Post("singup")
    createuser(@Body() dto: dtoUser) {
        console.log("POST");
        const res = this.userService.registrationNewUser(dto)
        return res
    }
}
