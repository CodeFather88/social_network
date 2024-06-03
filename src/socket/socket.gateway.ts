import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { CreateChatDto } from 'src/chat/dto/createChat.dto';
import { CreateMessageDto } from 'src/chat/dto/createMessage.dto';
import { MessageService } from 'src/message/message.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, Socket[]> = new Map(); // Используем Map для хранения подключений по userId

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService
  ) { }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.headers.authorization;
      if (!token) {
        client.disconnect(true);
        return;
      }
      const payload = await this.verifyToken(token);
      client['user'] = payload;

      this.addClient(client, payload.id);

      const userChats = await this.chatService.getUserChats(payload.id);
      userChats.forEach(chat => {
        client.join(chat.id);
      });

      console.log(`Количество подключенных клиентов: ${this.getAllClients().length}`);
      this.logConnectedClients();
    } catch (error) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('createChat')
  async createChat(@MessageBody() dto: CreateChatDto, @ConnectedSocket() client: Socket): Promise<void> {
    const currentUserId = client['user']?.id;
    const result = await this.chatService.create(dto, currentUserId);

    const roomId = result.id;
    const promises = dto.addedUsers.map(userId => this.addUserToRoom(userId, roomId));
    await Promise.all(promises);
    const eventToRoom = 'createChatResponse';

    const currentUserClients = this.clients.get(currentUserId) || [];
    currentUserClients.forEach(client => {
      client.emit(eventToRoom, { result });
    });
    this.server.to(roomId).emit(eventToRoom, { result });
  }

  @SubscribeMessage('createMessage')
  async createMessage(@MessageBody() dto: CreateMessageDto, @ConnectedSocket() client: Socket): Promise<void> {
    const currentUserId = client['user']?.id;
    const result = await this.messageService.create(dto, currentUserId);
    const roomId = dto.chatId
    // const promises = dto.addedUsers.map(userId => this.addUserToRoom(userId, roomId));
    // await Promise.all(promises);
    const eventToRoom = 'createMessageResponse';

    const currentUserClients = this.clients.get(currentUserId) || [];
    currentUserClients.forEach(client => {
      client.emit(eventToRoom, { result, ImSender: true });
    });
    this.server.to(roomId).emit(eventToRoom, { result });
  }

  private async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(
      token,
      {
        secret: this.configService.get('JWT_SECRET')
      }
    );
  }

  private addClient(client: Socket, userId: string): void {
    const userClients = this.clients.get(userId) || [];
    userClients.push(client);
    this.clients.set(userId, userClients);
    console.log(`New client connected: ${userId}`);
  }

  private logConnectedClients(): void {
    this.clients.forEach((sockets, userId) => {
      sockets.forEach(socket => console.log({ userId, socketId: socket.id }));
    });
  }

  private async addUserToRoom(userId: string, roomId: string): Promise<void> {
    const userSockets = this.clients.get(userId) || [];
    userSockets.forEach(socket => {
      socket.join(roomId);
    });
  }

  handleDisconnect(client: Socket) {
    const userId = client['user']?.id;
    if (userId) {
      const userSockets = this.clients.get(userId) || [];
      const updatedSockets = userSockets.filter(connectedClient => connectedClient !== client);
      if (updatedSockets.length === 0) {
        this.clients.delete(userId);
      } else {
        this.clients.set(userId, updatedSockets);
      }
    }
    console.log(`Client disconnected: ${client.id}`);
    console.log(`Количество подключенных клиентов: ${this.getAllClients().length}`);
    this.logConnectedClients();
  }

  private getAllClients(): Socket[] {
    return Array.from(this.clients.values()).flat();
  }
}
