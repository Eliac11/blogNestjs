import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @ApiOperation({ description: "Get All Users" })
    @ApiQuery({ name: 'pagenum', required: false })
    @ApiQuery({ name: 'pagesize', required: false })
    @ApiTags("Users")
    @Get("")
    async getUsers(
        @Query("pagenum") pagenum?: number,
        @Query("pagesize") pagesize?: number
    ) {
        pagenum = pagenum ? parseInt(pagenum.toString(), 10) : 1
        pagesize = pagesize ? parseInt(pagesize.toString(), 10) : 10

        return await this.userService.getUsers(pagenum, pagesize)
    }

    @ApiOperation({ description: "Get One User" })
    @ApiTags("Users")
    @Get("/:username")
    async getUser(@Param("username") username: string) {
        return this.userService.getOneUser(username)
    }

    @ApiOperation({ description: "Get User Posts" })
    @ApiTags("Users")
    @Get("/:username/posts")
    async getUserPosts(@Param("username") username: string) {
        return await this.userService.getUserPosts(username)
    }
}
