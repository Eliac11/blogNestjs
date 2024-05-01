import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) { }

    async findOne(username: string) {
        return this.databaseService.user.findFirst(
            {
                where: {
                    username: username
                }
            }
        );
    }

}
