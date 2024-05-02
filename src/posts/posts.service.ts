import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category, Prisma, Tag, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { dtoCategory } from 'src/dto/category.dto';
import { dtoPost } from 'src/dto/post.dto';
import { dtoTag } from 'src/dto/tag.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userService: UsersService
    ) { }


    async getAllPosts() {
        return this.databaseService.post.findMany({include:{
            tags: true,
            categories:true,
            author:{
                select:{
                    username:true
                }
            }
        }})
    }

    async createCategory(dto: dtoCategory) {
        const existingCategory = await this.databaseService.category.findFirst({ where: { name: dto.name } })
        if (existingCategory) {
            throw new HttpException(`Categotie ${dto.name} exist`, 422)
        }

        return this.databaseService.category.create({data: dto})
    }

    async getAllCategorys() {
        return this.databaseService.category.findMany()
    }

    async createTag(dto: dtoTag) {
        const existingTag = await this.databaseService.tag.findFirst({ where: { name: dto.name } })
        if (existingTag) {
            throw new HttpException(`Tag ${dto.name} exist`, 422)
        }

        return this.databaseService.tag.create({data: dto})
    }

    async getAllTags() {
        return this.databaseService.tag.findMany()
    }

    async createPost(dto: dtoPost, user: any) {
        const { tags, categories, ...postData } = dto

        const existingTags: Tag[] = []
        const existingCategories: Category[] = []

        for (const tag of tags) {
            const existingTag = await this.databaseService.tag.findFirst({ where: { name: tag } })
            if (existingTag) {
                existingTags.push(existingTag)
            } else {
                throw new HttpException(`Tag ${tag} not exist`, 422)
            }
        }

        for (const category of categories) {
            const existingCategory = await this.databaseService.category.findFirst({ where: { name: category }})
            if (existingCategory) {
                existingCategories.push(existingCategory)
            } else {
                throw new HttpException(`Categorie ${category} not exist`, 422)
            }
        }

        const post = await this.databaseService.post.create({
            data: {
                ...postData,
                tags: { connect: existingTags.map(tag => ({ id: tag.id })) },
                categories: { connect: existingCategories.map(category => ({ id: category.id })) },
                author: {
                    connect: await this.userService.findOne(user.username)
                }
            },
            include: {
                author: true,
                tags: true,
                categories:true
            }
        });

        return post
    }

    async getOnePost(postid: number){
        return await this.databaseService.post.findFirst({ 
            where: {id: postid}, 
            include: {tags: true, categories: true}
        })
    }

    async delOnePost(postid: number, user: any){

        const existingPost = await this.databaseService.post.findFirst({ where: { id: postid } })

        if (existingPost == null){
            throw new HttpException("Not Found", 404)
        }

        if (existingPost.authorId != user.sub){
            throw new HttpException("Forbidden", 403)
        }
        
        return this.databaseService.post.delete({where:{id: postid} })
    }
}
