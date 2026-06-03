import type { Socket } from "socket.io-client";

export type GameOverState = {
	winnerColor: "w" | "b" | null;
	reason: string;
	resultString: string;
} | null;

export type MessageType = {
	from: string;
	message: string;
	timeStamp: string;
	avatarUrl?: string;
};

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
	messages: MessageType[];
	setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
	handleTimeOut: () => void;

	surrender: () => void;
	proposeDraw: () => void;
	proposeRematch: () => void;
	startOnlineGame: () => void;
	startBotGame: () => void;
	handleDrawResponse: (accept: boolean) => void;
	handleRematchResponse: (accept: boolean) => void;
};
