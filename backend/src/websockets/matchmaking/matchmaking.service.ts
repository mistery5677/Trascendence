import { Injectable, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from '../game.service';

@Injectable()
export class MatchMakingService {
  private queue: Socket[] = [];
  private readonly logger = new Logger(MatchMakingService.name);

  constructor(private readonly gameService: GameService) {}

  addToQueue(client: Socket, server: Server) {
    if (
      this.queue.find((c) => c.data.user.userId === client.data.user.userId)
    ) {
      this.logger.warn(
        `Player ${client.data.user.username} is already on queue`,
      );
      return;
    }
    this.queue.push(client);

    this.logger.log(
      `Player ${client.data.user.username} joined the queue. Current queue size: ${this.queue.length}`,
    );

    if (this.queue.length >= 2) {
      this.createMatch(server);
    }
  }

  private createMatch(server: Server) {
    const player1 = this.queue.shift();
    const player2 = this.queue.shift();
    if (!player1 || !player2) return;

    const gameId = uuidv4();

    this.gameService.createGame(
      gameId,
      'online',
      player1.data.user.userId,
      player2.data.user.userId,
    );

    player1.join(gameId);
    player2.join(gameId);

    player1.emit('matchFound', {
      gameId,
      color: 'w',
      opponent: player2.data.user.username,
    });

    player2.emit('matchFound', {
      gameId,
      color: 'b',
      opponent: player1.data.user.username,
    });

    this.logger.log(
      `Match created: ${gameId} | Players: ${player1.data.user.username} vs ${player2.data.user.username}`,
    );
  }

  removeFromQueue(client: Socket) {
    const initialSize = this.queue.length;
    this.queue = this.queue.filter((c) => c.id !== client.id);

    if (initialSize !== this.queue.length) {
      this.logger.log(
        `Player ${client.data.user?.email || client.id} removed from queue.`,
      );
    }
  }
}
