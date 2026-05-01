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
import { MatchMakingService } from './matchmaking/matchmaking.service';
import { JwtService } from '@nestjs/jwt';
import { WsMiddleware } from './middleware/ws.middleware';
import { GameService } from './game.service';
import { v4 as uuidv4 } from 'uuid';
import { it } from 'node:test';

@WebSocketGateway()
export class GameGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly matchMakingService: MatchMakingService,
    private readonly jwtService: JwtService,
    private readonly gameService: GameService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  afterInit() {
    this.server.use(WsMiddleware(this.jwtService));
  }

  handleDisconnect(client: Socket) {
    this.matchMakingService.removeFromQueue(client);
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.matchMakingService.addToQueue(client, this.server);
  }

  //   @SubscribeMessage('startBotGame')
  //   handleStartBot(@ConnectedSocket() client: Socket) {
  //     const gameId = `bot_${uuidv4()}`;
  //     console.log(gameId);

  //     this.gameService.createGame(gameId, 'bot', client.data.user.userId);
  //     client.join(gameId);

  //     client.emit('matchFound', {
  //       gameId,
  //       color: 'w',
  //       opponent: 'Bot (Random moves)',
  //     });
  //   }

  @SubscribeMessage('joinGame')
  handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string },
  ) {
    const game = this.gameService.getGame(data.gameId);
    if (!game) {
      client.emit('error', { message: 'Partida no encontrada' });
      return;
    }

    // 1. Meter al socket en la sala (CRÍTICO para recibir movimientos)
    client.join(data.gameId);

    // 2. Usar tu lógica de GameService
    const state = this.gameService.getGameState(data.gameId);
    if (!state) return;
    const userId = client.data.user.userId;
    const userColor = userId === game.playerW ? 'w' : 'b';

    // 3. Emitir el mismo evento que el Matchmaking
    client.emit('gameState', {
      gameId: data.gameId,
      fen: state.fen,
      currentTurn: state.turn, // Sincronizamos nombre con el frontend
      color: userColor,
      mode: state.mode,
      opponent: userColor === 'w' ? 'Oponente' : 'Oponente', // Aquí podrías buscar el nombre real si quieres
    });

   console.log(`User ${userId} rejoin to the room ${data.gameId}`);
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
        result: gameOver.resultString,
        reason: gameOver.reason,
      });
      return true;
    }
    return false;
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    const { gameId, message } = parsedData;

    console.log(`Sending Message to the room: ${gameId}`);

    if (gameId) {
      this.server.to(gameId).emit('receiveMessage', {
        from: client.data.user.username,
        message: message,
        timeStamp: new Date().toLocaleTimeString(),
      });
    } else {
      console.error("ERROR: gameId Wasn't sended on message");
    }
  }
}
