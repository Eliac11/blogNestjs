import { HttpException, Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';


@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService){}
}
