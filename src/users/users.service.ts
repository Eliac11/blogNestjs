import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { dtoUser } from 'src/dto/user.dto';


@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) { }


    async findOneForAuth(username: string) {
        const res = await this.databaseService.user.findFirst(
            {
                where: {
                    username: username
                },
                include: {
                    profile: true
                }
            }
        )
        if (res == null) throw new UnauthorizedException()
        return res
    }

    async getOneUser(username: string) {
        const res = await this.databaseService.user.findFirst(
            {
                where: {
                    username: username
                },
                select: {
                    id: true,
                    username: true,
                    profile: true,
                    role: true,
                    createdAt: true
                }
            }
        )
        if (res == null) throw new HttpException("Not Found", 404)
        return res
    }




    async getUsers(pagenum: number, pagesize: number) {

        const skip = (pagenum - 1) * pagesize
        const totalCount = await this.databaseService.user.count()

        
        const users = await this.databaseService.user.findMany(
            {
                skip: skip,
                take: pagesize,
                select: {
                    id: true,
                    username: true,
                    profile: true,
                    role: true,
                    createdAt: true
                }
            }
        )

        return {
            data: users,
            pageNum: pagenum,
            pageSize: users.length,
            totalCount: totalCount
        }
    }


    async createEmptyProfile(userId: number) {
        let existingProfile = await this.databaseService.profile.findFirst({
            where: { userId: userId }
        })
        if (existingProfile !== null) {

            throw new HttpException('Profile is exists', 422)
        }
        const new_profile = this.databaseService.profile.create({
            data: { bio: "", userId: userId, avatar: "https://t4.ftcdn.net/jpg/00/23/72/59/360_F_23725944_W2aSrg3Kqw3lOmU4IAn7iXV88Rnnfch1.jpg" }
        })

        return new_profile
    }

    async createUser(dto: dtoUser) {

        let existingUser = await this.databaseService.user.findFirst({
            where: { email: dto.email }
        })
        if (existingUser !== null) {

            throw new HttpException('User with this email already exists', 422)
        }

        existingUser = await this.databaseService.user.findFirst({
            where: { username: dto.username }
        })

        if (existingUser) {
            throw new HttpException('User with this username already exists', 422)
        }

        const new_user = this.databaseService.user.create({
            data: dto,
            select: {
                username: true,
                id: true
            }
        })

        return new_user

    }

    async getUserPosts(username: string) {
        const userposts = await this.databaseService.user.findFirst({
            where: { username },
            select: {
                posts: {
                    include: {
                        author: {
                            select: {
                                username: true,
                                id: true
                            }
                        }
                    }
                }
            }
        })

        if (userposts == null) throw new HttpException("Not Found", 404)
        return userposts.posts
    }


}
