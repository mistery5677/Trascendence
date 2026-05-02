import type { Socket } from "socket.io-client";

export type GameOverState = {
  winnerColor: "w" | "b" | null;
  reason: string;
  resultString: string;
} | null;

export type GameContextType = {
  socket: Socket | null;
  gameId: string | null;
  color: "w" | "b" | null;
  isConnected: boolean;
  fen: string;
  currentTurn: "w" | "b";
  gameOver: GameOverState;
  surrender: () => void;
  proposeDraw: () => void;
};
