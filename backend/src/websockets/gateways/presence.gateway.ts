import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PresenceService } from '../services/presence.service';
import { JwtService } from '@nestjs/jwt';
import { WsMiddleware } from '../middleware/ws.middleware';

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer() server?: Server;
  constructor(
    private readonly presenceService: PresenceService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit() {
    this.server?.use(WsMiddleware(this.jwtService));
  }

  handleConnection(client: Socket) {
    const userId = client.data.user.userId;
    client.join(`user_${userId}`);
    this.presenceService.setConnected(userId, client.id);

    this.server?.emit('userStatusChanged', { userId, status: 'online' });
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user.userId;
    this.presenceService.setDisconnected(userId);

    this.server?.emit('userStatusChanged', { userId, status: 'offline' });
  }
}
