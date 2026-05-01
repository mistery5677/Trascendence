import type { Socket } from "socket.io-client";

export type GameContextType = {
  socket: Socket | null;
  gameId: string | null;
  color: "w" | "b" | null;
  isConnected: boolean;
  fen: string;
  currentTurn: "w" | "b";
};
