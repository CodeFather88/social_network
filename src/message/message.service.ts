import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { CreateMessageDto } from 'src/chat/dto/createMessage.dto';

@Injectable()
export class MessageService {
    constructor(private readonly prismaService: PrismaService) { }
    
    async create(dto: CreateMessageDto, currentUserId: string) {
        const result = await this.prismaService.message.create({
            data: {
                text: dto.text,
                chatId: dto.chatId,
                userId: currentUserId
            }
        })
        return result
    }
}
