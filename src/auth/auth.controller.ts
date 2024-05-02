import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { dtoSingIn } from 'src/dto/singin.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { dtoUser } from 'src/dto/user.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiTags("Auth")
    @Post('singin')
    signIn(@Body() signInDto: dtoSingIn) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @ApiTags("Auth")
    @Post("singup")
    singUp(@Body() dto: dtoUser) {
        const res = this.authService.singup(dto)
        return res
    }

    @ApiTags("Auth")
    @UseGuards(AuthGuard)
    @Get("me")
    @ApiBearerAuth()
    getprofile(@Request() req) {
        return req.user;
    }


}
