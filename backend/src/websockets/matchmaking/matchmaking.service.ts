import { Injectable, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MatchMakingService {
  private queue: Socket[] = [];
  private readonly logger = new Logger(MatchMakingService.name);

  addToQueue(client: Socket, server: Server) {
    if (this.queue.find((c) => c.id === client.id)) {
      this.logger.warn(`Player ${client.data.userEmail} is already on queue`);
      return;
    }
    this.queue.push(client);
    const user = client.data.user;

    this.logger.log(
      `Player ${client.data.user.userEmail} joined the queue. Current queue size: ${this.queue.length}`,
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

    player1.join(gameId);
    player2.join(gameId);

    const matchData = {
      gameId,
      opponent: player2.data.user.email,
    };

    // Emit to the room (both players)
    server.to(gameId).emit('matchFound', matchData);

    this.logger.log(
      `Match created: ${gameId} | Players: ${player1.data.user.userEmail} vs ${player2.data.user.userEmail}`,
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
