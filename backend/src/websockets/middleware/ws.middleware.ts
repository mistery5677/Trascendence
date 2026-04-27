import { JwtService } from '@nestjs/jwt';
import { parse } from 'cookie';
import { Socket } from 'socket.io';

export const WsMiddleware = (jwtService: JwtService) => {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const cookies = socket.handshake.headers.cookie || '';
      const token = parse(cookies)['access_token'];

      if (!token) {
        throw new Error('Unauthorized');
      }
      const payload = await jwtService.verifyAsync(token);
      socket.data.user = { userId: payload.userId, userEmail: payload.userEmail };
      next();
    } catch (err: any) {
      next(new Error('Unauthorized'));
    }
  };
};
