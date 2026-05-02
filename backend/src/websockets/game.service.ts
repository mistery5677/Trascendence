import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';
import { MatchesService } from 'src/matches/matches.service';

interface GameOverResult {
  winnerColor: 'w' | 'b' | null;
  reason: 'CHECKMATE' | 'DRAW' | 'STALEMATE' | 'THREEFOLD_REPETITION';
}

interface GameInstance {
  chess: Chess;
  mode: 'online' | 'bot';
  playerW: string;
  playerB: string;
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
    console.log(playerWId);
    const newGame: GameInstance = {
      chess: new Chess(),
      mode: mode,
      playerW: playerWId,
      playerB: playerBId,
    };
    this.games.set(gameId, newGame);
    return newGame;
  }

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
        parseInt(game.playerB),
        parseInt(game.playerW),
        winnerId,
      );
    }

    return {
      winnerColor,
      reason,
    };
  }
}
