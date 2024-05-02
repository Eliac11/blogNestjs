import { Body, Controller, Get, Param, ParseIntPipe, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }


    @ApiTags("Users")
    @Get("")
    async getUsers() {
        return this.userService.getUsers()
    }

    @ApiTags("Users")
    @Get("/:username")
    async getUser(@Param("username") username: string) {
        return this.userService.findOne(username)
    }

    @ApiTags("Users")
    @Get("/:username/posts")
    async getUserPosts(@Param("username") username: string) {
        return await this.userService.getUserPosts(username)
    }
}
