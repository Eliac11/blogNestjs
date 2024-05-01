import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
    constructor( private readonly userService: UsersService){}

    @Get("/:username")
    getUser(@Param("username") username: string){
        return this.userService.findOne(username)
    }
}
