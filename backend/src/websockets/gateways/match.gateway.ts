import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MatchMakingService } from '../services/matchmaking.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { WsMiddleware } from '../middleware/ws.middleware';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from '../services/game.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway()
export class MatchGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly matchMakingService: MatchMakingService,
    private readonly gameService: GameService,
    private readonly userService: UsersService,
  ) {}

  afterInit() {
    this.server.use(WsMiddleware(this.jwtService));
  }
  @SubscribeMessage('joinQueue')
  handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.matchMakingService.addToQueue(client, this.server);
  }

  @SubscribeMessage('startBotGame')
  handleStartBot(@ConnectedSocket() client: Socket) {
    const gameId = `bot_${uuidv4()}`;

    const newGame = this.gameService.createGame(
      gameId,
      'bot',
      client.data.user.userId,
    );

    client.join(gameId);

    client.emit('gameState', {
      gameId: gameId,
      color: 'w',
      opponent: 'Bot (Random moves)',
      fen: newGame.chess.fen(),
      currentTurn: newGame.chess.turn(),
      mode: 'bot',
    });
  }
  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    const game = this.gameService.getGame(data.gameId);
    if (!game) {
      client.emit('error', { message: 'Game not Found' });
      return;
    }

    client.join(data.gameId);

    const state = this.gameService.getGameState(data.gameId);
    if (!state) return;
    const userId = client.data.user.userId;
    const userColor = userId === game.playerW ? 'w' : 'b';

    const opponentId = userId === game.playerW ? game.playerB : game.playerW;

    let opponentName = 'Bot';
    if (game.mode !== 'bot') {
      const opponent = await this.userService.findOneById(parseInt(opponentId));
      opponentName = opponent?.username || 'Unknown';
    }

    client.emit('gameState', {
      gameId: data.gameId,
      fen: state.fen,
      currentTurn: state.turn,
      color: userColor,
      mode: state.mode,
      opponent: opponentName,
    });

    console.log(`User ${userId} rejoin to the room ${data.gameId}`);
  }
}
