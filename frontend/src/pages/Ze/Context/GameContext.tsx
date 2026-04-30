import React, { createContext, useContext, useEffect, useState } from "react";
import type { GameContextType } from "./GameType";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [color, setColor] = useState<"w" | "b" | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  if (!authState.user) return;

  useEffect(() => {
    const socketInstance = io("/", {
      withCredentials: true,
      path: "/socket.io",
    });
    socketInstance.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      if (mode === "bot") {
        console.log("Starting game against Bot");
        socketInstance.emit("startBotGame");
      } else {
        console.log("Joining Queue");
        socketInstance.emit("joinQueue");
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.error("Connection Error:", err.message);
      setIsConnected(false);
    });

    socketInstance.on("matchFound", (data) => {
      setGameId(data.gameId);
      setColor(data.color);
      navigate(`?mode=${mode}&gameId=${data.gameId}`);
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
