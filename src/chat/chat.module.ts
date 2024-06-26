import { Module } from '@nestjs/common';
// import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { JwtModule } from '@nestjs/jwt';
import { options } from '@auth/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@auth/guards/auth.guard';
import { ChatController } from './chat.controller';
import { MessageService } from 'src/message/message.service';
import { MessageModule } from 'src/message/message.module';

@Module({
	providers: [
		// ChatGateway,
		ChatService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	imports: [JwtModule.registerAsync(options()), MessageModule],
	controllers: [ChatController],
	exports: [ChatService],
})
export class ChatModule {}
