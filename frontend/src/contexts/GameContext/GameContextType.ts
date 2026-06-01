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
	opponentId: string | null;
	gameOver: GameOverState;
	drawProposal: boolean;
	rematchProposal: boolean;

	// Timer variables
	myTimeLeft: number;
	opponentTimeLeft: number;
	handleTimeOut: () => void;

	surrender: () => void;
	proposeDraw: () => void;
	proposeRematch: () => void;
	joinQueue: () => void;
	startBotGame: () => void;
	onNoActiveGame: () => void;
	handleDrawResponse: (accept: boolean) => void;
	handleRematchResponse: (accept: boolean) => void;
};
