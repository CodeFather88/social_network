import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from 'src/chat/chat.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  providers: [SocketGateway, JwtService],
  imports: [ChatModule, MessageModule]
})
export class SocketModule {}
