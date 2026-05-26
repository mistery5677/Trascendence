import { Injectable, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from './game.service';

@Injectable()
export class MatchMakingService {
  private queue: Socket[] = [];
  private readonly logger = new Logger(MatchMakingService.name);

  constructor(private readonly gameService: GameService) {}

    addToQueue(client: Socket, server: Server) {
      const userId = client.data.user.userId;

      this.queue = this.queue.filter(
        (queuedSocket) => queuedSocket.data.user.userId !== userId,
      );
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

//   addToQueue(client: Socket, server: Server) {
//     try {
//       // 1. Control de seguridad: Validar que el usuario exista en el socket
//       const user = client.data?.user;
//       if (!user || !user.userId) {
//         this.logger.error(
//           `[Queue Error] Rejection: Socket ${client.id} doesn't have user data attached.`,
//         );
//         return;
//       }

//       const userId = user.userId;
//       this.logger.log(
//         `[Queue Attempt] Player ${user.username} (ID: ${userId}) is trying to join.`,
//       );

//       // 2. Limpieza preventiva estricta:
//       // Filtramos la cola para sacar CUALQUIER conexión vieja o duplicada de este usuario.
//       const initialSize = this.queue.length;
//       this.queue = this.queue.filter(
//         (queuedSocket) => queuedSocket.data?.user?.userId !== userId,
//       );

//       if (this.queue.length !== initialSize) {
//         this.logger.log(
//           `[Queue Cleanup] Removed ${initialSize - this.queue.length} old/duplicate socket(s) for user ${user.username}`,
//         );
//       }

//       // 3. Añadir el socket nuevo y válido a la cola
//       this.queue.push(client);

//       this.logger.log(
//         `[Queue Success] Player ${user.username} successfully joined. Current queue size: ${this.queue.length}`,
//       );

//       // 4. Disparar emparejamiento si hay suficientes jugadores
//       if (this.queue.length >= 2) {
//         this.logger.log(
//           `[Matchmaking] Sufficient players found (${this.queue.length}). Creating match...`,
//         );
//         this.createMatch(server);
//       }
//     } catch (error) {
//       this.logger.error(`[Queue Critical Error] Exception in addToQueue:`);
//     }
//   }

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

    const game = this.gameService.getGame(gameId);
    if (!game) return;

    const commonData = {
      gameId,
      fen: game.chess.fen(),
      currentTurn: game.chess.turn(),
      mode: 'online',
    };

    player1.emit('gameState', {
      ...commonData,
      color: 'w',
      opponentId: player2.data.user.userId,
    });

    player2.emit('gameState', {
      ...commonData,
      color: 'b',
      opponentId: player1.data.user.userId,
    });

    this.logger.log(
      `Match created: ${gameId} | Players: ${player1.data.user.username} vs ${player2.data.user.username}`,
    );
  }

  removeFromQueue(client: Socket) {
    const initialSize = this.queue.length;
    this.queue = this.queue.filter(
      (queuedSocket) => queuedSocket.id !== client.id,
    );

    if (initialSize !== this.queue.length) {
      this.logger.log(
        `Player ${client.data.user?.username || client.id} removed from queue.`,
      );
    }
  }
}
