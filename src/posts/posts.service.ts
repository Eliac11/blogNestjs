import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Category, Prisma, Tag, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { dtoCategory } from 'src/dto/category.dto';
import { dtoPost } from 'src/dto/post.dto';
import { dtoReaction } from 'src/dto/reaction.dto';
import { dtoTag } from 'src/dto/tag.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly userService: UsersService
    ) { }


    async getAllPosts(pagenum: number, pagesize: number) {

        const skip = (pagenum - 1) * pagesize
        const totalCount = await this.databaseService.user.count()

        const posts = await this.databaseService.post.findMany({
            skip: skip,
            take: pagesize,
            include: {
                tags: true,
                categories: true,
                author: {
                    select: {
                        username: true
                    }
                }
            }
        })

        return {
            data: posts,
            pageNum: pagenum,
            pageSize: posts.length,
            totalCount: totalCount
        }
    }

    async createCategory(dto: dtoCategory) {
        const existingCategory = await this.databaseService.category.findFirst({ where: { name: dto.name } })
        if (existingCategory) {
            throw new HttpException(`Categotie ${dto.name} exist`, 422)
        }

        return this.databaseService.category.create({ data: dto })
    }

    async getAllCategorys() {
        return this.databaseService.category.findMany()
    }

    async createTag(dto: dtoTag) {
        const existingTag = await this.databaseService.tag.findFirst({ where: { name: dto.name } })
        if (existingTag) {
            throw new HttpException(`Tag ${dto.name} exist`, 422)
        }

        return this.databaseService.tag.create({ data: dto })
    }

    async getAllTags() {
        return this.databaseService.tag.findMany()
    }

    private async getValidateTags(tags: string[]) {

        const existingTags: Tag[] = []

        for (const tag of tags) {
            const existingTag = await this.databaseService.tag.findFirst({ where: { name: tag } })
            if (existingTag) {
                existingTags.push(existingTag)
            } else {
                throw new HttpException(`Tag ${tag} not exist`, 422)
            }
        }
        return existingTags
    }

    private async getValidateCategories(categories: string[]) {

        const existingCategories: Category[] = []

        for (const category of categories) {
            const existingCategory = await this.databaseService.category.findFirst({ where: { name: category } })
            if (existingCategory) {
                existingCategories.push(existingCategory)
            } else {
                throw new HttpException(`Categorie ${category} not exist`, 422)
            }
        }

        return existingCategories
    }


    async createPost(dto: dtoPost, user: any) {
        const { tags, categories, ...postData } = dto

        const existingTags: Tag[] = await this.getValidateTags(tags)
        const existingCategories: Category[] = await this.getValidateCategories(categories)

        const post = await this.databaseService.post.create({
            data: {
                ...postData,
                tags: { connect: existingTags.map(tag => ({ id: tag.id })) },
                categories: { connect: existingCategories.map(category => ({ id: category.id })) },
                author: {
                    connect: await this.userService.findOneForAuth(user.username)
                }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                tags: true,
                categories: true
            }
        })

        return post
    }

    async updatePost(postid: number, dto: dtoPost, user: any) {


        await this.chekKeeperPost(postid, user)

        const { tags, categories, ...postData } = dto

        const existingTags: Tag[] = await this.getValidateTags(tags)
        const existingCategories: Category[] = await this.getValidateCategories(categories)


        return this.databaseService.post.update({
            where: { id: postid },
            include: { tags: true, categories: true },
            data: {
                ...postData,
                tags: {
                    disconnect: await this.getAllTags(),
                    connect: existingTags.map(tag => ({ id: tag.id }))
                },
                categories: {
                    disconnect: await this.getAllCategorys(),
                    connect: existingCategories.map(category => ({ id: category.id }))
                },
            }
        })
    }

    async getOnePost(postid: number) {
        return await this.databaseService.post.findFirst({
            where: { id: postid },
            include: { tags: true, categories: true }
        })
    }

    async delOnePost(postid: number, user: any) {

        await this.chekKeeperPost(postid, user)

        return this.databaseService.post.delete({ where: { id: postid } })
    }

    async addViewPost(postid: number, user: any) {
        const existingPost = await this.databaseService.post.findFirst({ where: { id: postid } })

        if (existingPost == null) {
            throw new HttpException("Post Not Found", 404)
        }

        const existingView = await this.databaseService.postView.findFirst({ where: { postId: postid, userId: user.sub } })

        if (existingView) {
            throw new HttpException("Viewed", 422)
        }

        const view = await this.databaseService.postView.create({
            data: {
                postId: postid,
                userId: user.sub
            }
        })

        await this.databaseService.post.update({ where: { id: postid }, data: { views: existingPost.views + 1 } })

        return view

    }

    async addReactionPost(postid: number, user: any, dtoReaction: dtoReaction) {
        const existingPost = await this.databaseService.post.findFirst({ where: { id: postid } })

        if (existingPost == null) {
            throw new HttpException("Post Not Found", 404)
        }

        const existingReaction = await this.databaseService.postReaction.findFirst({ where: { postId: postid, userId: user.sub } })

        if (existingReaction) {
            throw new HttpException("Reaction found", 422)
        }

        const newVote = await this.databaseService.postReaction.create({
            data: {
                postId: postid,
                userId: user.sub,
                ...dtoReaction
            }
        })

        if (newVote.reaction == -1) {
            await this.databaseService.post.update({ where: { id: postid }, data: { downvotes: existingPost.downvotes + 1 } })
        }
        else {
            await this.databaseService.post.update({ where: { id: postid }, data: { upvotes: existingPost.upvotes + 1 } })
        }
        return newVote
    }

    private async chekKeeperPost(postid: number, user: any) {
        const existingPost = await this.databaseService.post.findFirst({ where: { id: postid } })

        if (existingPost == null) {
            throw new HttpException("Not Found", 404)
        }

        if (existingPost.authorId != user.sub) {
            throw new HttpException("Forbidden", 403)
        }

        return true
    }




    async findPosts(
        title?: string,
        category?: string[],
        tags?: string[],
        authorId?: number,
        sortBy?: 'newest' | 'upvotes'
    ) {
        const where: any = {}

        if (title) {
            where.title = {
                contains: title,
            }
        }

        if (authorId) {
            where.authorId = authorId
        }

        if (category && category.length > 0) {
            where.categories = {
                some: {
                    name: {
                        in: category,
                    },
                },
            }
        }

        if (tags && tags.length > 0) {
            where.tags = {
                some: {
                    name: {
                        in: tags,
                    },
                },
            }
        }

        const orderBy: any = sortBy === 'newest' ? { createdAt: 'desc' } : { upvotes: 'desc' }

        const posts = await this.databaseService.post.findMany({
            where,
            orderBy,
            include: {
                author: {
                    select: {
                        username: true,
                        id: true
                    }
                },
                categories: true,
                tags: true,
            },
        })

        return posts
    }
}
