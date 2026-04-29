import React, { createContext, useContext, useEffect, useState } from "react";
import type { GameContextType } from "./GameType";
import { io, Socket } from "socket.io-client";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [color, setColor] = useState<"w" | "b" | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io("/", {
      withCredentials: true,
      path: "/socket.io",
    });
    socketInstance.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      console.log("Joining Queue");
      socketInstance.emit("joinQueue");
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection Error:", err.message);
      setIsConnected(false);
    });

    socketInstance.on("matchFound", (data) => {
      setGameId(data.gameId);
      setColor(data.color);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <GameContext.Provider value={{ socket, gameId, color, isConnected }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used inside GameProvider");
  }
  return context;
};
