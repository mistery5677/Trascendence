import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  private logger = new Logger(WsGuard.name);
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();

    const cookies = client.handshake.headers.cookie;
    if (!cookies) {
      this.logger.error('Cookies not found on handshake');
      return false;
    }

    const token = cookies.split('access_token=')[1]?.split(';')[0];
    if (!token) {
      this.logger.error('JWT Token not found on cookies');
      return false;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      client.data.user = {
        userId: payload.sub,
        email: payload.email,
      };
      this.logger.log('Valid Token');
      return true;
    } catch (e) {
      this.logger.error('Expired or Invalid Token');
      return false;
    }

    return true;
  }
}
