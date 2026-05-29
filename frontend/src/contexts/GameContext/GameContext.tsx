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

	//Timer variables
	//TODO: Make the timer choosed by the room mode created
	const [myTimeLeft, setMyTimeLeft] = useState<number>(10);
	const [opponentTimeLeft, setOpponentTimeLeft] = useState<number>(10);

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

	const handleTimeOut = () => {
		if (socket && gameId) {
			console.log("Time is over");
			socket.emit("timeOut", { gameId });
		}
	}

	useEffect(() => {
		// If there is no game, it means that is over
        if (!gameId || gameOver || !color) return;

        const isMyTurn = currentTurn === color;

        const interval = setInterval(() => {
            if (isMyTurn) {
                setMyTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleTimeOut(); // Timed out
                        return 0;
                    }
                    return prev - 1;
                });
            } else {
                setOpponentTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }
        }, 1000); // 1 second

        return () => clearInterval(interval);
    }, [gameId, currentTurn, color, gameOver]);


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

			// Read the timer came from the server
			if (data.color === 'w') {
                setMyTimeLeft(data.whiteTimeLeft ?? 10);
                setOpponentTimeLeft(data.blackTimeLeft ?? 10);
            } else {
                setMyTimeLeft(data.blackTimeLeft ?? 10);
                setOpponentTimeLeft(data.whiteTimeLeft ?? 10);
            }

			console.log("DADOS QUE CHEGARAM DO BACKEND NO REFRESH:", data);
		});

		socketInstance.on("move", (data: any) => {
			console.log("Move");
			setFen(data.fen);
			setCurrentTurn(data.currentTurn);

			// Get the updated timer after each move
			if (color) {
                if (color === 'w') {
                    setMyTimeLeft(data.whiteTimeLeft ?? myTimeLeft);
                    setOpponentTimeLeft(data.blackTimeLeft ?? opponentTimeLeft);
                } else {
                    setMyTimeLeft(data.blackTimeLeft ?? myTimeLeft);
                    setOpponentTimeLeft(data.whiteTimeLeft ?? opponentTimeLeft);
                }
            }
		});

		socketInstance.on("gameOver", (data: any) => {
			console.log("Game Finished:", data);
			setGameOver(data.gameOver);
		});

		setSocket(socketInstance);
		return () => {
			socketInstance.disconnect();
		};
	}, [gameId, mode, color]);
	useEffect(() => {
		if (!socket || !gameId) {
			return;
		}

		socket.on("drawProposed", (data: any) => {
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

				// Timer variables
				myTimeLeft,
                opponentTimeLeft,
                handleTimeOut,
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
