import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from './jwtconst';
import { DatabaseModule } from 'src/database/database.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [DatabaseModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
    })],
  providers: [AuthService, UsersService],
  controllers: [AuthController]
})
export class AuthModule { }
