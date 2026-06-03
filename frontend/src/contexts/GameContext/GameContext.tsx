import React, { createContext, useContext, useEffect, useState } from "react";
import type { GameContextType, GameOverState, MessageType } from "./GameContextType";
import { useAuth } from "../UserContext";
import { useGlobalSocket } from "../GlobalSocketContext/GlobalSocketContext";
import { toastWrapper } from "../../adapters/toastWrapper";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
	const { socket } = useGlobalSocket();
	const { state: authState } = useAuth();

	const [gameId, setGameId] = useState<string | null>(null);
	const [color, setColor] = useState<"w" | "b" | null>("w");
	const [fen, setFen] = useState("start");
	const [currentTurn, setCurrentTurn] = useState<"w" | "b">("w");
	const [gameOver, setGameOver] = useState<GameOverState>(null);
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [drawProposal, setDrawProposal] = useState<boolean>(false);
	const [rematchProposal, setRematchProposal] = useState<boolean>(false);
	const [opponentId, setOpponentId] = useState<string | null>(null);

	const gameIdRef = React.useRef<string | null>(null);
	const hasUser = !!authState.user;
	//Timer variables
	//TODO: Make the timer choose by the room mode created
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

	const handleRematchResponse = (accept: boolean) => {
		if (socket && gameId) {
			socket.emit("respondRematch", {
				gameId: gameId,
				response: accept,
			});
			setRematchProposal(false);
		}
	};

	const handleTimeOut = () => {
		if (socket && gameId) {
			console.log("Time is over");
			socket.emit("timeOut", { gameId });
		}
	};

	const startOnlineGame = () => {
		if (!socket || !hasUser) return;

		console.log("[Game] Joining the Queue");
		toastWrapper.warn("Waiting for opponent. Please be patient...");

		setGameOver(null);
		setGameId(null);
		setOpponentId(null);
		setMessages([]);
		socket.emit("joinQueue");
	};

	const startBotGame = () => {
		if (!socket || !hasUser) return;

		console.log("[Game] Starting game with bot");
		setGameOver(null);
		setGameId(null);
		setOpponentId(null);
		setMessages([]);
		socket.emit("startBotGame");
	};

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
		if (!socket || !hasUser) return;

		console.log("[Game] Checking for active games");
		socket.emit("checkActiveGame");

		const onGameState = (data: any) => {
			if (!gameIdRef.current && data.fen === "start") {
				toastWrapper.success("Opponent Found! Match has started.");
			} else if (!gameIdRef.current && data.fen !== "start") {
				toastWrapper.success("Reconnected to your active match.");
			}
			setGameId(data.gameId);
			gameIdRef.current = data.gameId;
			setColor(data.color);
			setFen(data.fen);
			setCurrentTurn(data.currentTurn);
			setOpponentId(data.opponentId);

			if (data.chatHistory) {
				setMessages(data.chatHistory);
			}

			// Read the timer came from the server
			if (data.color === "w") {
				setMyTimeLeft(data.whiteTimeLeft ?? 10);
				setOpponentTimeLeft(data.blackTimeLeft ?? 10);
			} else {
				setMyTimeLeft(data.blackTimeLeft ?? 10);
				setOpponentTimeLeft(data.whiteTimeLeft ?? 10);
			}
		};

		const onNoActiveGame = () => {
			console.log("There is no active Game, you can start on lateral buttons");
		};

		const onMove = (data: any) => {
			setFen(data.fen);
			setCurrentTurn(data.currentTurn);
			if (color) {
				if (color === "w") {
					setMyTimeLeft(data.whiteTimeLeft ?? myTimeLeft);
					setOpponentTimeLeft(data.blackTimeLeft ?? opponentTimeLeft);
				} else {
					setMyTimeLeft(data.blackTimeLeft ?? myTimeLeft);
					setOpponentTimeLeft(data.whiteTimeLeft ?? opponentTimeLeft);
				}
			}
		};

		const onGameOver = (data: any) => {
			setGameOver(data.gameOver);
		};

		const onActiveGameNotFound = () => {
			alert("Your match finish on unexpected way");
			setGameId(null);
			gameIdRef.current = null;
		};

		const onError = (data: any) => {
			if (data.message === "Game not Found") {
				alert("The match doesn't exist anymore");
			}
		};

		socket.on("gameState", onGameState);
		socket.on("noActiveGame", onNoActiveGame);
		socket.on("move", onMove);
		socket.on("gameOver", onGameOver);
		socket.on("activeGameNotFound", onActiveGameNotFound);
		socket.on("error", onError);

		return () => {
			console.log("[Game] Exiting of game board. Removing all listeners");
			socket.off("noActiveGame", onNoActiveGame);
			socket.off("gameState", onGameState);
			socket.off("move", onMove);
			socket.off("gameOver", onGameOver);
			socket.off("activeGameNotFound", onActiveGameNotFound);
			socket.off("error", onError);
		};
	}, [socket]);

	useEffect(() => {
		if (!socket || !gameId) {
			return;
		}

		const onDrawProposed = () => setDrawProposal(true);
		const onRematchProposed = () => setRematchProposal(true);
		const onDrawRejected = () => {
			toastWrapper.warn("The draw proposal was rejected.");
		};

		const onRematchRejected = () => {
			toastWrapper.error("The Rematch proposal was rejected.");
		};
		const onRematchStarted = (data: { newGameId: string }) => {
			toastWrapper.success("Rematch started! Good luck.");
			setGameOver(null);
			setDrawProposal(false);
			setRematchProposal(false);
			setGameId(data.newGameId);
			gameIdRef.current = data.newGameId;

			socket.emit("checkActiveGame");
		};

		socket.on("rematchProposed", onRematchProposed);
		socket.on("drawProposed", onDrawProposed);
		socket.on("drawRejected", onDrawRejected);
		socket.on("rematchRejected", onRematchRejected);
		socket.on("rematchStarted", onRematchStarted);

		return () => {
			socket.off("drawProposed", onDrawProposed);
			socket.off("rematchProposed", onRematchProposed);
			socket.off("drawRejected", onDrawRejected);
			socket.off("rematchRejected", onRematchRejected);
			socket.off("rematchStarted", onRematchStarted);
		};
	}, [socket, gameId]);
	if (!authState.user) return null;

	return (
		<GameContext.Provider
			value={{
				socket,
				gameId,
				color,
				isConnected: !!socket?.connected,
				fen,
				currentTurn,
				gameOver,
				surrender,
				drawProposal,
				rematchProposal,
				handleDrawResponse,
				handleRematchResponse,
				proposeDraw,
				proposeRematch,
				startOnlineGame,
				startBotGame,
				opponentId,
				// For component Chat Persistence
				messages,
				setMessages,
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
