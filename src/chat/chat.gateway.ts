import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io'; // Используем правильный импорт для Socket
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChat.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

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

    const roomId = result.id;
    const promises = [...dto.addedUsers, currentUserId].map(userId => this.addUserToRoom(userId, roomId));
    await Promise.all(promises);

    const eventToRoom = 'createChatResponse';

    this.server.to(roomId).emit(eventToRoom, { result });
  }

  private async addUserToRoom(userId: string, roomId: string): Promise<void> {
    const userSocket = this.getUserSocket(userId);
    if (userSocket) {
      userSocket.join(roomId);
    }
  }

  private getUserSocket(userId: string): Socket | undefined {
    return this.clients.find(client => client['user']?.id === userId);
  }

  handleDisconnect(client: Socket) {
    this.clients = this.clients.filter(connectedClient => connectedClient !== client);
    console.log(`Client disconnected: ${client.id}`);
    console.log(`Количество подключенных клиентов: ${this.clients.length}`);
    this.clients.forEach(c => console.log(c['user']));
  }
}
