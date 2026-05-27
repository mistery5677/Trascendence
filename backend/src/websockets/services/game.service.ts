import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';
import { MatchesService } from 'src/matches/matches.service';
import { v4 as uuidv4 } from 'uuid';

interface GameOverResult {
  winnerColor: 'w' | 'b' | null;
  reason:
    | 'CHECKMATE'
    | 'DRAW'
    | 'STALEMATE'
    | 'THREEFOLD_REPETITION'
    | 'RESIGNATION'
    | 'DISCONNECTION_TIMEOUT';
}

interface GameInstance {
  chess: Chess;
  mode: 'online' | 'bot';
  playerW: string;
  playerB: string;
  isFinished?: boolean;
}

@Injectable()
export class GameService {
  private games = new Map<string, GameInstance>();
  constructor(private readonly matchesService: MatchesService) {}

  createGame(
    gameId: string,
    mode: 'online' | 'bot',
    playerWId: string,
    playerBId: string = 'bot',
  ) {
    const newGame: GameInstance = {
      chess: new Chess(),
      mode: mode,
      playerW: playerWId,
      playerB: playerBId,
    };
    this.games.set(gameId, newGame);
    return newGame;
  }

//   createRematch(oldGameId: string) {
//     const oldGame = this.games.get(oldGameId);
//     if (!oldGame) {
//       console.log('Old Game Not found');
//       return null;
//     }

//     const newGameId = uuidv4();

//     const playerWId = oldGame.playerB;
//     const playerBId = oldGame.playerW;

//     this.createGame(newGameId, 'online', playerWId, playerBId);
//     this.deleteGame(oldGameId);
//     return { newGameId };
//   }

  getGame(gameId: string): GameInstance | undefined {
    return this.games.get(gameId);
  }

  makeMove(gameId: string, move: any) {
    const game = this.games.get(gameId);
    if (!game) return null;

    try {
      const result = game.chess.move(move);
      return result;
    } catch (e) {
      return null;
    }
  }

  generateBotMove(gameId: string) {
    const game = this.games.get(gameId);
    if (!game || game.chess.isGameOver()) return null;

    const possibleMoves = game.chess.moves();
    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.chess.move(randomMove);
    return randomMove;
  }

  getGameState(gameId: string) {
    const game = this.games.get(gameId);
    if (!game) return null;

    return {
      fen: game.chess.fen(),
      turn: game.chess.turn(),
      history: game.chess.history(),
      mode: game.mode,
    };
  }

  checkGameOver(gameId: string): GameOverResult | null {
    const game = this.getGame(gameId);
    if (!game || !game.chess.isGameOver()) return null;

    const chess = game.chess;
    let winnerColor: 'w' | 'b' | null = null;

    let reason: GameOverResult['reason'] = 'DRAW';

    if (chess.isCheckmate()) {
      reason = 'CHECKMATE';
      winnerColor = chess.turn() === 'w' ? 'b' : 'w';
    } else if (chess.isStalemate()) {
      reason = 'STALEMATE';
    } else if (chess.isThreefoldRepetition()) {
      reason = 'THREEFOLD_REPETITION';
    } else if (chess.isDraw()) {
      reason = 'DRAW';
    }

    let winnerId: number | null = null;
    if (winnerColor === 'w') winnerId = parseInt(game.playerW);
    if (winnerColor === 'b') winnerId = parseInt(game.playerB);

    if (game.mode === 'online') {
      this.matchesService.saveMatchResult(
        parseInt(game.playerW),
        parseInt(game.playerB),
        winnerId,
      );
    }
    this.markAsFinished(gameId);
    return {
      winnerColor,
      reason,
    };
  }
  surrender(gameId: string, surrenderPlayerId: string): GameOverResult | null {
    const game = this.getGame(gameId);
    if (!game) return null;

    const winnerColor: 'w' | 'b' =
      surrenderPlayerId !== game.playerB ? 'b' : 'w';
    const winnerId = winnerColor === 'w' ? game.playerW : game.playerB;

    if (game.mode === 'online') {
      this.matchesService.saveMatchResult(
        parseInt(game.playerW),
        parseInt(game.playerB),
        parseInt(winnerId),
      );
    }
    this.markAsFinished(gameId);
    return { winnerColor, reason: 'RESIGNATION' };
  }
  forceDraw(gameId: string): GameOverResult | null {
    const game = this.getGame(gameId);
    if (!game) return null;

    if (game.mode === 'online') {
      this.matchesService.saveMatchResult(
        parseInt(game.playerW),
        parseInt(game.playerB),
        null,
      );
    }
    this.markAsFinished(gameId);
    return { winnerColor: null, reason: 'DRAW' };
  }

  deleteGame(gameId: string) {
    const game = this.getGame(gameId);
    if (!game) {
      return null;
    }
    this.games.delete(gameId);
  }
  markAsFinished(gameId: string) {
    const game = this.games.get(gameId);
    if (game) {
      game.isFinished = true;
    }
  }
  findActiveGameByUserId(userId: string): {
    gameId: string;
    game: GameInstance;
  } | null {
    for (const [gameId, game] of this.games.entries()) {
      if (
        !game.isFinished &&
        (game.playerW === userId || game.playerB === userId)
      ) {
        return { gameId, game };
      }
    }
    return null;
  }
}
