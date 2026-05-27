import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../services/game.service';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('requestSurrender')
  handleSurrender(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    const game = this.gameService.getGame(data.gameId);
    if (!game) return;

    const userId = client.data.user.userId;
    if (game.playerW !== userId && game.playerB !== userId) {
      client.emit('error', { message: "Don't belong to this game." });
      return;
    }

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
    const game = this.gameService.getGame(data.gameId);
    if (!game) return;

    const userId = client.data.user.userId;
    if (game.playerW !== userId && game.playerB !== userId) {
      client.emit('error', { message: "Don't belong to this game." });
      return;
    }

    client.to(data.gameId).emit('drawProposed', { from: client.id });
  }

  @SubscribeMessage('respondDraw')
  handleRespondDraw(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; response: boolean },
  ) {
    const game = this.gameService.getGame(data.gameId);
    if (!game) return;

    const userId = client.data.user.userId;
    if (game.playerW !== userId && game.playerB !== userId) {
      client.emit('error', { message: "Don't belong to this game." });
      return;
    }

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
    const game = this.gameService.getGame(data.gameId);
    if (!game) return;

    const userId = client.data.user.userId;
    if (game.playerW !== userId && game.playerB !== userId) {
      client.emit('error', { message: "Don't belong to this game." });
      return;
    }

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
    if (!game) return;

    const userId = client.data.user.userId;
    if (game.playerW !== userId && game.playerB !== userId) {
      client.emit('error', { message: "Don't belong to this game." });
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

    const userId = client.data.user.userId;
    const currentTurn = game.chess.turn();
    const expectedPlayerId = currentTurn === 'w' ? game.playerW : game.playerB;

    if (userId !== expectedPlayerId) {
      client.emit('error', {
        message: "Don't belong to this game or its not your turn",
      });
      return;
    }

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
