import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { dtoSingIn } from 'src/dto/singin.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiTags("Auth")
    @Post('singin')
    signIn(@Body() signInDto: dtoSingIn) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }
    
    @UseGuards(AuthGuard)
    @Get("me")
    @ApiBearerAuth()
    getprofile(@Request() req) {
        return req.user;
    }
}
