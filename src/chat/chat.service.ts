import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateChatDto } from './dto/createChat.dto';

@Injectable()
export class ChatService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(dto: CreateChatDto, currentUserId: string) {
        const usersExist = await this.prismaService.user.count({
            where: {
                id: { in: dto.addedUsers },
            },
        });
        if (usersExist !== dto.addedUsers.length) {
            throw new Error('Некоторые пользователи не найдены');
        }
        const usersInChat = [...dto.addedUsers, currentUserId]
        return await this.prismaService.chat.create({
            data: {
                name: dto.name,
                creator: currentUserId,
                usersCount: usersInChat.length,
                users: {
                    create: usersInChat.map(userId => ({
                        user: {
                            connect: { id: userId },
                        },
                    })),
                },
            },
        });
    }

}
