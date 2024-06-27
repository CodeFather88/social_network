import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto';
import { CurrentUser } from '@shared/decorators';
import { User } from '@prisma/client';

@ApiTags('Posts')
@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Get('getAll')
	async getAllPosts() {
		return await this.postService.findAll();
	}

	@ApiBearerAuth()
	@Post('create')
	async createPost(@Body() dto: CreatePostDto, @CurrentUser() user: User) {
		return await this.postService.create(dto, user.id);
	}
}
