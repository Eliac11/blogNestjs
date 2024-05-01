import { Body, Controller, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { dtoUser } from './dto/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("data/:int")
  getUsers(@Param("int", ParseIntPipe) int: number){
    return this.appService.getUsers()
  }
  @UsePipes( new ValidationPipe())
  @Post("adduser")
  createuser(@Body() dto: dtoUser){
    console.log("POST");
    const res = this.appService.saveUser(dto)
    return res
  }
}
