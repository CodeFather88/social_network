import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { GUARDS } from '@auth/guards'
import { JwtModule } from '@nestjs/jwt'
import { options } from '@auth/config'
import { MessageModule } from './message/message.module';
import { SocketModule } from './socket/socket.module';
import { RedisModule } from './redis/redis.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';

@Module({
  imports: [
    JwtModule.registerAsync(options()), 
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PrismaModule,
    AuthModule, 
    MessageModule, 
    SocketModule,
    RedisModule,
    PostModule,
    CommentModule,
    LikeModule, 
  ],
  controllers: [AppController],
  providers: [AppService, ...GUARDS],
})
export class AppModule { }