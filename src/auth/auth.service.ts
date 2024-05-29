import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@user/user.service';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@prisma/client';
import { PrismaService } from '@prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import { Tokens } from './interfaces';

@Injectable()
export class AuthService {
    constructor(private readonly prismaServise: PrismaService, private readonly userService: UserService, private readonly jwtService: JwtService) { }

    async register(dto: RegisterDto) {
        return await this.userService.create(dto)
    }

    async login(dto: LoginDto): Promise<Tokens> {
        const user = await this.userService.findOne(dto.email)
        if (!user || !compareSync(dto.password, user.password)) {
            return null
        }
        const accessToken = this.jwtService.sign({ id: user.id, roles: user.roles })
        const refreshToken = await this.getRefreshToken(user.id)
        return { accessToken, refreshToken }
    }

    private async getRefreshToken(userId: string): Promise<Token> {
        return this.prismaServise.token.create({
            data: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId
            }
        })
    }
}