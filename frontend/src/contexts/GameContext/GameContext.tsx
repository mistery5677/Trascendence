import React, { createContext, useContext, useEffect, useState } from "react";
import type { GameContextType, GameOverState } from "./GameContextType";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../UserContext";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children, mode }: { children: React.ReactNode; mode: string }) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const { state: authState } = useAuth();
	const [gameId, setGameId] = useState<string | null>(null);
	const [color, setColor] = useState<"w" | "b" | null>("w");
	const [fen, setFen] = useState("start");
	const [currentTurn, setCurrentTurn] = useState<"w" | "b">("w");
	const [isConnected, setIsConnected] = useState(false);
	const [gameOver, setGameOver] = useState<GameOverState>(null);
	const [drawProposal, setDrawProposal] = useState<boolean>(false);
	const [opponentId, setOpponentId] = useState<string | null>(null);
	const gameIdRef = React.useRef<string | null>(null);

	if (!authState.user) return null;

	const surrender = () => {
		if (socket && gameId) {
			socket.emit("requestSurrender", { gameId });
		}
	};

	const proposeDraw = () => {
		if (socket && gameId) {
			socket.emit("proposeDraw", { gameId });
		}
	};
	const proposeRematch = () => {
		if (socket && gameId) {
			socket.emit("proposeRematch", { gameId });
		}
	};

	const handleDrawResponse = (accept: boolean) => {
		if (socket && gameId) {
			socket.emit("respondDraw", {
				gameId: gameId,
				response: accept,
			});
		}
		setDrawProposal(false);
	};

	useEffect(() => {
		const socketInstance = io("/", {
			withCredentials: true,
			path: "/socket.io",
		});

		socketInstance.on("connect", () => {
			console.log("Connected to server");
			setIsConnected(true);

			if (gameIdRef.current) {
				console.log("Reconnection game on going");
				return;
			}
			if (mode === "bot") {
				console.log("Starting game against Bot");
				socketInstance.emit("startBotGame");
			} else {
				console.log("Joining Queue");
				socketInstance.emit("joinQueue");
			}
		});

		socketInstance.on("gameState", (data: any) => {
			setGameId(data.gameId);
			gameIdRef.current = data.gameId;
			setColor(data.color);
			setFen(data.fen);
			setCurrentTurn(data.currentTurn);
			setIsConnected(true);
			setOpponentId(data.opponentId);
		});

		socketInstance.on("move", (data: any) => {
			console.log("Move");
			setFen(data.fen);
			setCurrentTurn(data.currentTurn);
		});

		socketInstance.on("gameOver", (data: any) => {
			console.log("Game Finished:", data);
			setGameOver(data.gameOver);
		});

		setSocket(socketInstance);
		return () => {
			socketInstance.disconnect();
		};
	}, [gameId, mode]);
	useEffect(() => {
		if (!socket || !gameId) {
			return;
		}

		socket.on("drawProposed", (data) => {
			console.log("Propose Sent to :", data.gameId);
			setDrawProposal(true);
		});

		socket.on("drawRejected", () => {
			alert("The draw proposal was rejected.");
		});

		return () => {
			socket.off("drawProposed");
			socket.off("drawRejected");
		};
	}, [socket, gameId]);

	return (
		<GameContext.Provider
			value={{
				socket,
				gameId,
				color,
				isConnected,
				fen,
				currentTurn,
				gameOver,
				surrender,
				drawProposal,
				handleDrawResponse,
				proposeDraw,
				proposeRematch,
				opponentId,
			}}>
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
