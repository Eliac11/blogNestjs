import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { dtoSingIn } from 'src/dto/singin.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { dtoUser } from 'src/dto/user.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({description:"Singin"})
    @ApiTags("Auth")
    @UsePipes(new ValidationPipe({whitelist:true}))
    @Post('singin')
    signIn(@Body() dto: dtoSingIn) {
        return this.authService.signIn(dto.username, dto.password)
    }

    @ApiOperation({description:"Singup"})
    @ApiTags("Auth")
    @UsePipes(new ValidationPipe({whitelist:true}))
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
        return req.user
    }


}
