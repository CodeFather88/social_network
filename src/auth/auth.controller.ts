import { Controller, Post, Body, Get, Res, HttpStatus, UnauthorizedException, Req } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Tokens } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { Cookie } from '@shared/decorators/cookies.decorators';
import { UserAgent } from '@shared/decorators/user-agent.decorator';
import { agent } from 'supertest';

const REFRESH_TOKEN = 'refreshtoken'

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) { }

    @ApiOperation({ summary: 'login' })
    @Post('login')
    async login(@Body() dto: LoginDto, @Res() res: Response, @UserAgent() agent: string) {
        console.log(agent)
        const tokens = await this.authService.login(dto, agent)
        if (!tokens) {
            return null
        }
        await this.setRefreshTokenToCookies(tokens, res)
        res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken })
    }

    @ApiOperation({ summary: 'register' })
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return await this.authService.register(dto)
    }

    @ApiOperation({ summary: 'refresh-tokens' })
    @Get('refresh-tokens')
    async refreshTokens(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response, @UserAgent() agent: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }
        const tokens = await this.authService.refreshTokens(refreshToken, agent);
        if (!tokens) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        await this.setRefreshTokenToCookies(tokens, res);
        res.status(HttpStatus.OK).json({ accessToken: tokens.accessToken });
    }


    private async setRefreshTokenToCookies(tokens: Tokens, res: Response) {
        if (!tokens) {
            throw new UnauthorizedException()
        }
        res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            secure: this.configService.get('NODE_ENV', 'development') === 'production',
            path: '/'
        })
    }
}