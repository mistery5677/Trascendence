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
import { MatchMakingService } from '../services/matchmaking.service';
import { GameService } from '../services/game.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: true })
export class PresenceGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer() server?: Server;
  constructor(
    private readonly presenceService: PresenceService,
    private readonly jwtService: JwtService,
    private readonly matchMakingService: MatchMakingService,
    private readonly gameService: GameService,
    private readonly userService: UsersService,
  ) {}

  afterInit() {
    this.server?.use(WsMiddleware(this.jwtService));
  }

  handleConnection(client: Socket) {
    const user = client.data?.user;
    if (!user || !user.userId) {
      console.error(
        `[Presence] Connection rejected: User data missing in socket.data`,
      );
      client.disconnect(true);
      return;
    }

    const userId = user.userId;

    this.presenceService.setConnected(userId, client.id);

    if (this.server) {
      const allSockets = this.server.sockets.sockets;
      for (const [socketId, prevSocket] of allSockets.entries()) {
        if (
          socketId !== client.id &&
          prevSocket.data?.user?.userId === userId
        ) {
          console.log(`[Presence] Kill zombie socket for user ${userId}`);
          prevSocket.disconnect(true);
        }
      }
    }

    client.join(`user_${userId}`);

    this.server?.emit('userStatusChanged', { userId, status: 'online' });

    const activeMatch = this.gameService.findActiveGameByUserId(userId);
    if (activeMatch) {
      this.gameService.clearAbandonTimeout(activeMatch.gameId);
      client.join(activeMatch.gameId);
    }

    console.log(
      `[Presence] User:${userId} successfully connected, ${client.id}`,
    );
  }

  handleDisconnect(client: Socket) {
    const user = client.data?.user;

    if (!user || !user.userId) return;

    const userId = user.userId;

    this.matchMakingService.removeFromQueue(client);

    const isRealDisconnect = this.presenceService.setDisconnected(
      userId,
      client.id,
    );

    if (isRealDisconnect) {
      this.server?.emit('userStatusChanged', { userId, status: 'offline' });
      console.log(`[Presence] User ${user.username} fully disconnected.`);
      const activeMatch = this.gameService.findActiveGameByUserId(userId);
      if (activeMatch && activeMatch.game.mode === 'online') {
        this.gameService.startAbandonTimeout(
          activeMatch.gameId,
          userId,
          this.server,
        );
      } else {
        console.log(
          `[Presence] Ignored old socket cleanup for user ${user.username}`,
        );
      }
    }
  }
}
