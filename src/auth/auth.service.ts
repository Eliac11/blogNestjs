import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { dtoUser } from 'src/dto/user.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }


    async hashPassword(password: string) {
        return await bcrypt.hash(password, 2)

    }

    async signIn(username: string, pass: string) {
        const user = await this.usersService.findOne(username);
        try {
            if (!await bcrypt.compare(
                pass,
                user?.password
            )) {
                throw new UnauthorizedException();
            }
        }
        catch {
            throw new UnauthorizedException();
        }

        const { password, ...result } = user;
        const payload = { sub: user.id, username: user.username, attime: new Date().toString(), role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async singup(dto: dtoUser) {

        dto.password = await this.hashPassword(dto.password)

        const user = await this.usersService.createUser(dto)

        this.usersService.createEmptyProfile(user.id)

        return user
    }
}
