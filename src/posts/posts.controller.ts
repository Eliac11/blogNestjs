import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { dtoPost } from 'src/dto/post.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { dtoCategory } from 'src/dto/category.dto';
import { dtoTag } from 'src/dto/tag.dto';
import { DatabaseService } from 'src/database/database.service';
import { dtoReaction } from 'src/dto/reaction.dto';

@Controller('posts')
export class PostsController {
    constructor(private readonly postService: PostsService) { }

    @ApiTags("Posts")
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard)
    @Post("")
    @ApiBearerAuth()
    async create(@Body() dto: dtoPost, @Request() req) {
        const res = this.postService.createPost(dto, req.user)
        return res
    }

    @ApiTags("Posts")
    @Get("")
    async getAll() {
        const res = this.postService.getAllPosts()
        return res
    }

    @ApiTags("Posts")
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard)
    @Post("categories")
    @ApiBearerAuth()
    async createcategiory(@Body() dto: dtoCategory, @Request() req) {

        if (req.user.role !== "admin") {
            throw new HttpException("Bad role", 403)
        }
        const res = this.postService.createCategory(dto)
        return res
    }

    @ApiTags("Posts")
    @UsePipes(new ValidationPipe())
    @Get("categories")
    async getCategiorys() {

        return this.postService.getAllCategorys()
    }

    @ApiTags("Posts")
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard)
    @Post("tags")
    @ApiBearerAuth()
    async createtag(@Body() dto: dtoTag, @Request() req) {

        if (req.user.role !== "admin") {
            throw new HttpException("Bad role", 403)
        }
        const res = this.postService.createTag(dto)
        return res
    }

    @ApiTags("Posts")
    @UsePipes(new ValidationPipe())
    @Get("tags")
    async getTag() {

        return this.postService.getAllTags()
    }

    @ApiTags("Posts")
    @Get("post/:id")
    async getOnePost(@Param("id", ParseIntPipe) id: number) {
        const res = await this.postService.getOnePost(id)
        if (res == null) {
            throw new HttpException("Not Found", 404)
        }
        return res
    }

    @ApiTags("Posts")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Post("post/:id/view")
    async addViewPost(@Param("id", ParseIntPipe) id: number, @Request() req) {

        return this.postService.addViewPost(id, req.user)
    }

    @ApiTags("Posts")
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @ApiBearerAuth()
    @Post("post/:id/voite")
    async addVoitePost(@Param("id", ParseIntPipe) id: number, @Body() dto: dtoReaction, @Request() req) {

        return this.postService.addReactionPost(id, req.user, dto)
    }

    @ApiTags("Posts")
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Delete("post/:id")
    async gelOnePost(@Param("id", ParseIntPipe) id: number, @Request() req) {

        return this.postService.delOnePost(id, req.user)
    }

    @ApiTags("Posts")
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    @ApiBearerAuth()
    @Patch("post/:id")
    async updateOnePost(
        @Param("id", ParseIntPipe) id: number, 
        @Body() dto: dtoPost, 
        @Request() req
    ) {

        return this.postService.updatePost(id, dto, req.user)
    }

    
    @ApiTags("Find")
    @ApiQuery({ name: 'title', required: false })
    @ApiQuery({ name: 'category', required: false, isArray: true })
    @ApiQuery({ name: 'tags', required: false, isArray: true })
    @ApiQuery({ name: 'authorId', required: false })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'upvotes'] })
    @Get("find")
    async findPosts(
        @Query('title') title?: string,
        @Query('category') category?: string[],
        @Query('tags') tags?: string[],
        @Query('authorId') authorId?: number,
        @Query('sortBy') sortBy?: 'newest' | 'upvotes',
    ) {


        if (typeof category === 'string') {
            category = [category];
        }

        if (typeof tags === 'string') {
            tags = [tags];
        }

        return this.postService.findPosts(title, category, tags, authorId, sortBy);
    }

}
