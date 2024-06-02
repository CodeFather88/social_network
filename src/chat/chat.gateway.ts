import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io'; // Используем правильный импорт для Socket
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';
import { Chat } from '@prisma/client';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients: Socket[] = []; // Хранение списка клиентов

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService
  ) { }

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization;
    if (!token) {
      client.disconnect(true);
      return;
    }
  
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get('JWT_SECRET')
        }
      );
      client['user'] = payload;
  
      const existingClient = this.clients.find(c => c['user']?.id === payload.id);
      if (existingClient) {
        this.clients = this.clients.map(c => c['user']?.id === payload.id ? client : c);
        console.log(`Client reconnected: ${payload.id}`);
      } else {
        this.clients.push(client);
        console.log(`New client connected: ${payload.id}`);
      }
  
      console.log(`Количество подключенных клиентов: ${this.clients.length}`);
      this.clients.forEach(c => console.log(c['user']));
    } catch (error) {
      client.disconnect(true);
    }
  }

 
  @SubscribeMessage('createChat')
  async createChat(@MessageBody() dto: CreateChatDto, @ConnectedSocket() client: Socket): Promise<void> {
    const currentUserId = client['user']?.id; 
    const result = await this.chatService.create(dto, currentUserId);
  
    const promises = [...dto.addedUsers, currentUserId].map(userId => this.addUserToRoom(userId, result.id));
    await Promise.all(promises);
  
    const eventToRoom = 'createChatResponse'; // Поменяйте на свое желаемое событие
  
    if (client.rooms.has(result.id)) {
      client.to(result.id).emit(eventToRoom, { result });
    } else {
      console.log('Client not in room, not sending message');
    }
  }
  
  

// Метод для добавления пользователя в комнату
private async addUserToRoom(userId: string, roomId: string): Promise<void> {
  const userSocket = this.getUserSocket(userId);
  // console.log(userSocket)
  if (userSocket) {
    userSocket.join(roomId);
  }
}

// Метод для получения соединения клиента по его ID
private getUserSocket(userId: string): Socket | undefined {
  this.clients.find(client => console.log(client['user']));
  return this.clients.find(client => client['user']?.id === userId);
  
}


handleDisconnect(client: Socket) {
  this.clients = this.clients.filter(connectedClient => connectedClient !== client);
  console.log(`Client disconnected: ${client.id}`);
  console.log(`Количество подключенных клиентов: ${this.clients.length}`);
  this.clients.forEach(c => console.log(c['user']));
}

}













 // @SubscribeMessage('message')
  // async message(@MessageBody() data: { word: string }, @ConnectedSocket() client: Socket): Promise<WsResponse<{ word: string, userId: string }>> {
  //   console.log(data);
  //   const userId = client['user']?.id; 
  //   const event = 'messageResponse';
  //   return { event, data: { ...data, userId } };
  // }
