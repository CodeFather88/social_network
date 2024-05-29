import { Controller, Request, Post, Body, Get } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'login' })
    @Post('login')
    async login(@Body() dto: LoginDto) {
        const tokens = await this.authService.login(dto)
        return {accessToken: tokens.accessToken}
    }

    @ApiOperation({ summary: 'register' })
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return await this.authService.register(dto)
    }

    @ApiOperation({ summary: 'refresh' })
    @Get('refresh')
    refreshTokens() { }
}