// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { Reflector } from '@nestjs/core';
// import { IS_PUBLIC_KEY } from '@shared/decorators';
// import { JwtPayload } from '@auth/interfaces';

// @Injectable()
// export class WebsocketAuthGuard implements CanActivate {
//     constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService, private reflector: Reflector) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);
//         if (isPublic) {
//             return true;
//         }
//         const client = context.switchToWs().getClient();
//         const token = this.extractTokenFromHeader(client);
//         if (!token) {
//             throw new UnauthorizedException();
//         }
//         try {
//             const payload: JwtPayload = await this.jwtService.verifyAsync(
//                 token,
//                 {
//                     secret: this.configService.get('JWT_SECRET')
//                 }
//             );
//             client['user'] = payload;
//         } catch {
//             throw new UnauthorizedException();
//         }
//         return true;
//     }

//     private extractTokenFromHeader(client: any): string | undefined {
//         const token = client.handshake.auth.token;
//         return token;
//     }
// }
