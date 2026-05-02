import React, { createContext, useContext, useEffect, useState } from "react";
import type { GameContextType, GameOverState } from "./GameType";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../UserContext";
import { useNavigate } from "react-router-dom";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({
  children,
  mode,
  gameId: urlGameId,
}: {
  children: React.ReactNode;
  mode: string;
  gameId: string | null;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState<string | null>(urlGameId);
  const [color, setColor] = useState<"w" | "b" | null>(null);
  const [fen, setFen] = useState("start");
  const [currentTurn, setCurrentTurn] = useState<"w" | "b">("w");
  const [isConnected, setIsConnected] = useState(false);
  const [gameOver, setGameOver] = useState<GameOverState>(null);

  if (!authState.user) return;

  useEffect(() => {
    const socketInstance = io("/", {
      withCredentials: true,
      path: "/socket.io",
    });

    socketInstance.on("connect", () => {
      console.log("Connected to server");

      if (urlGameId) {
        console.log("Reconnecting to game:", urlGameId);
        socketInstance.emit("joinGame", { gameId: urlGameId });
      } else if (mode === "bot") {
        console.log("Starting game against Bot");
        socketInstance.emit("startBotGame");
      } else {
        console.log("Joining Queue");
        socketInstance.emit("joinQueue");
      }
    });

    socketInstance.on("gameState", (data) => {
      setGameId(data.gameId || urlGameId);
      setColor(data.color);
      setFen(data.fen);
      setCurrentTurn(data.currentTurn);
      setIsConnected(true);

      if (data.gameId && !urlGameId)
        navigate(`?mode=${mode}&gameId=${data.gameId}`);
    });

    socketInstance.on("move", (data) => {
      console.log("Move");
      setFen(data.fen);
      setCurrentTurn(data.currentTurn);
    });

    socketInstance.on("gameOver", (data) => {
      console.log("Game Finished:", data);
      setGameOver(data.gameOver);
    });

    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <GameContext.Provider
      value={{ socket, gameId, color, isConnected, fen, currentTurn, gameOver }}
    >
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
