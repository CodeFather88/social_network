import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { options } from './config';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
    controllers: [AuthController],
    providers: [AuthService, {
        provide: APP_GUARD,
        useClass: AuthGuard,
    },],
    imports: [PassportModule, JwtModule.registerAsync(options()), UserModule],
})
export class AuthModule { }
