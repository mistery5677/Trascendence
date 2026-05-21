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
    const userId = client.data.user.userId;
    client.join(`user_${userId}`);
    this.presenceService.setConnected(userId, client.id);

    this.server?.emit('userStatusChanged', { userId, status: 'online' });

    const activeMatch = this.gameService.findActiveGameByUserId(userId);
    if (activeMatch) {
      const { gameId, game } = activeMatch;
      console.log(`[Reconnection] User ${userId} have a active game ${gameId}`);

      client.join(gameId);

      const state = this.gameService.getGameState(gameId);
      if (state) {
        const userColor = userId === game.playerW ? 'w' : 'b';
        const opponentId =
          userId === game.playerW ? game.playerB : game.playerW;

        client.emit('gameState', {
          gameId: gameId,
          fen: state.fen,
          currentTurn: state.turn,
          color: userColor,
          mode: game.mode,
          opponentId: opponentId || 'bot',
        });
        //! Still considering have a screen that tells the other player when user reconnect
        client.to(gameId).emit('opponentReconnected', { userId });
      }
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user.userId;
    this.matchMakingService.removeFromQueue(client);
    this.presenceService.setDisconnected(userId);
    this.server?.emit('userStatusChanged', { userId, status: 'offline' });
    console.log(
      `User ${client.data.user.username} disconnected and cleaned up.`,
    );
  }
}
