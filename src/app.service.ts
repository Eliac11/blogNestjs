import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { dtoUser } from './dto/user.dto';

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService){}
  getUsers(){
    return this.databaseService.user.findMany();
  }

  async saveUser(dto: dtoUser){

    let existingUser = await this.databaseService.user.findFirst({
      where: { email: dto.email }
    });
    if (existingUser !== null) {
      
      throw new HttpException('User with this email already exists', 422);
    }

    existingUser = await this.databaseService.user.findFirst({
      where: { username: dto.username }
    });

    if (existingUser) {
      throw new HttpException('User with this username already exists', 422);
    }

    return this.databaseService.user.create({
      data: dto
    });
  }
}
