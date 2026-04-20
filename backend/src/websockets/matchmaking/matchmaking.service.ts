import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MatchMakingService {
  private queue: Socket[] = [];
  private readonly logger = new Logger(MatchMakingService.name);

  addToQueue(client: Socket) {
    if (this.queue.find((c) => c.id === client.id)) {
      this.logger.warn(`Player ${client.data.user.email} is already on queue`);
      return;
    }
    this.queue.push(client);
    const user = client.data.user;

    this.logger.log(
      `Player ${client.data.user.email} joined the queue. Current queue size: ${this.queue.length}`,
    );

    if (this.queue.length > 2) {
      this.createMatch();
    }
  }

  private createMatch() {
    const player1 = this.queue.shift();
    const player2 = this.queue.shift();
    const gameId = uuidv4();
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
