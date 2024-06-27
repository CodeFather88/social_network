import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreatePostDto } from './dto';

@Injectable()
export class PostService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll() {
		const result = await this.prismaService.post.findMany();
		return { result };
	}

	async create(dto: CreatePostDto, userId: string) {
		const result = await this.prismaService.post.create({
			data: {
				title: dto.title,
				content: dto.content,
				userId,
			},
		});
		return result;
	}
}
