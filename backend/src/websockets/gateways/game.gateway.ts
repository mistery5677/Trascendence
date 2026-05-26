import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchMakingService } from '../services/matchmaking.service';
import { JwtService } from '@nestjs/jwt';
import { WsMiddleware } from '../middleware/ws.middleware';
import { GameService } from '../services/game.service';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  constructor(
    // private readonly matchMakingService: MatchMakingService,
    private readonly jwtService: JwtService,
    private readonly gameService: GameService,
  ) {}

  afterInit() {
    this.server.use(WsMiddleware(this.jwtService));
  }

  @SubscribeMessage('requestSurrender')
  handleSurrender(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    const result = this.gameService.surrender(
      data.gameId,
      client.data.user.userId,
    );
    if (result) {
      this.server.to(data.gameId).emit('gameOver', { gameOver: result });
    }
  }

  @SubscribeMessage('proposeDraw')
  handleDrawPropose(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    client.to(data.gameId).emit('drawProposed', { from: client.id });
  }

  @SubscribeMessage('respondDraw')
  handleRespondDraw(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; response: boolean },
  ) {
    if (data.response) {
      const result = this.gameService.forceDraw(data.gameId);
      if (result)
        this.server.to(data.gameId).emit('gameOver', { gameOver: result });
    } else {
      client.to(data.gameId).emit('drawRejected');
    }
  }

  @SubscribeMessage('proposeRematch')
  handleRematchPropose(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    client
      .to(data.gameId)
      .emit('rematchProposed', { fromId: client.data.user.userId });
  }

  @SubscribeMessage('respondRematch')
  handleRespondRematch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; response: boolean },
  ) {
    const game = this.gameService.getGame(data.gameId);
    if (!game) {
      console.error('Game NOT found');
      return;
    }
    if (data.response) {
      const newGameId = uuidv4();

      const newGame = this.gameService.createGame(
        newGameId,
        'online',
        game.playerB,
        game.playerW,
      );
      if (newGame) {
        this.server
          .to(data.gameId)
          .emit('rematchStarted', { newGameId: newGameId });
      } else {
        client.emit('error', { message: 'Could not generate rematch room' });
      }
    } else {
      client.to(data.gameId).emit('rematchRejected');
    }
  }

  @SubscribeMessage('move')
  handleMove(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; move: any },
  ) {
    const game = this.gameService.getGame(data.gameId);
    if (!game) return;

    const validMove = this.gameService.makeMove(data.gameId, data.move);
    if (!validMove) {
      client.emit('error', { message: 'Invalid Movement' });
      return;
    }

    this.processGameState(data.gameId, validMove);

    if (game.mode === 'bot' && !game.chess.isGameOver()) {
      setTimeout(() => {
        const botMove = this.gameService.generateBotMove(data.gameId);
        this.processGameState(data.gameId, botMove);
      }, 600);
    }
  }

  private processGameState(gameId: string, move: any): boolean {
    const game = this.gameService.getGame(gameId);

    this.server.to(gameId).emit('move', {
      move: move,
      fen: game?.chess.fen(),
      currentTurn: game?.chess.turn(),
    });

    const gameOver = this.gameService.checkGameOver(gameId);
    if (gameOver) {
      this.server.to(gameId).emit('gameOver', {
        gameOver: gameOver,
      });
      return true;
    }
    return false;
  }
}
