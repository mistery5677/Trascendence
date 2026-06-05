import { Injectable, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from './game.service';

type QueuePayload = {
  time?: string;
};

type QueueEntry = {
  client: Socket;
  time: string;
};

@Injectable()
export class MatchMakingService {
  private queue: QueueEntry[] = [];
  private readonly logger = new Logger(MatchMakingService.name);

  constructor(private readonly gameService: GameService) {}

  addToQueue(client: Socket, server: Server, payload?: QueuePayload) {
    const userId = client.data.user.userId;
    const selectedTime = payload?.time ?? '5 min';

    this.queue = this.queue.filter(
      (entry) => entry.client.data.user.userId !== userId,
    );

    this.queue.push({ client, time: selectedTime });

    this.logger.log(
      `Player ${client.data.user.username} joined queue (${selectedTime}). Current queue size: ${this.queue.length}`,
    );

    this.tryCreateMatch(server);
  }

  private tryCreateMatch(server: Server) {
    if (this.queue.length < 2) return;

    const first = this.queue[0];
    const secondIndex = this.queue.findIndex(
      (entry, index) => index > 0 && entry.time === first.time,
    );

    if (secondIndex === -1) return;

    const player1 = this.queue.shift();
    if (!player1) return;

    const player2 = this.queue.splice(secondIndex - 1, 1)[0];
    if (!player2) return;

    this.createMatch(server, player1, player2);
  }

  private createMatch(
    server: Server,
    player1: QueueEntry,
    player2: QueueEntry,
  ) {
    const gameId = uuidv4();
    const selectedTime = player1.time;

    this.gameService.createGame(
      gameId,
      'online',
      player1.client.data.user.userId,
      player2.client.data.user.userId,
      selectedTime,
    );

    player1.client.join(gameId);
    player2.client.join(gameId);

    const game = this.gameService.getGame(gameId);
    if (!game) return;

    const commonData = {
      gameId,
      fen: game.chess.fen(),
      currentTurn: game.chess.turn(),
      mode: 'online',
    };

    player1.client.emit('gameState', {
      ...commonData,
      color: 'w',
      opponentId: player2.client.data.user.userId,
      whiteTimeLeft: game.whiteTimeLeft,
      blackTimeLeft: game.blackTimeLeft,
    });

    player2.client.emit('gameState', {
      ...commonData,
      color: 'b',
      opponentId: player1.client.data.user.userId,
      whiteTimeLeft: game.whiteTimeLeft,
      blackTimeLeft: game.blackTimeLeft,
    });

    this.logger.log(
      `Match created: ${gameId} | Players: ${player1.client.data.user.username} vs ${player2.client.data.user.username}`,
    );
  }

  removeFromQueue(client: Socket) {
    const userId = client.data?.user?.userId;
    const username = client.data?.user?.username;
    if (!userId) return;

    const initialSize = this.queue.length;
    this.queue = this.queue.filter(
      (queuedSocket) => queuedSocket.client.data?.user?.userId !== userId,
    );

    if (initialSize !== this.queue.length) {
      this.logger.log(`User ${username} removed from matchmaking Queue.`);
    }
  }
}
