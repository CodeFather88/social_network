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
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule, 
    JwtModule.registerAsync(options()), 
    ConfigModule.forRoot({ isGlobal: true }), ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...GUARDS],
})
export class AppModule { }