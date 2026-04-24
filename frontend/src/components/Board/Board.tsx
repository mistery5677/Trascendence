import { Chessboard } from "react-chessboard";
import { useRef, useEffect } from "react";
import { Chess } from "chess.js";
import { useState } from "react";
import { handleGameOver } from "../../api/matches";
import { useAuth } from "../../contexts/UserContext";

export type PieceColor = "w" | "b";

type DraggingPieceDataType = {
	isSparePiece: boolean;
	position: string; // e.g. "a8" or "wP"
	pieceType: string; // e.g. "wP" for white pawn, "bK" for black king
};

type PieceDropHandlerArgs = {
	piece: DraggingPieceDataType;
	sourceSquare: string;
	targetSquare: string | null;
};

interface BoardProps {
	onTurnChange?: (color: PieceColor) => void;
}

const themes = {
	classic: {
		background: "#8b4513",
		pieces: "#5a3825",
		border: "#3e2723",
	},
	midnight: {
		background: "#2c3e50",
		pieces: "#34495e",
		border: "#ecf0f1",
	},
	forest: {
		background: "#4caf50",
		pieces: "#2e7d32",
		border: "#1b5e20",
	},
};

export function Board({ onTurnChange }: BoardProps) {
	const { state } = useAuth();
	const themeArray = [themes.forest, themes.classic, themes.midnight];

	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;

	const [chessPosition, setChessPosition] = useState(chessGame.fen());

	useEffect(() => {
		if (onTurnChange) {
			onTurnChange(chessGame.turn());
		}

		// Check if the game is finished
		if (chessGame.isGameOver()) {
			if (chessGame.isCheckmate()) {
				// If the black ('b') is playing and has check-mate, whites win
				const result = chessGame.turn() === "b" ? "PLAYER_A_WINS" : "PLAYER_B_WINS";

				// Call handle game over and use tests id
				handleGameOver(1, 2, result);
			} else if (chessGame.isDraw() || chessGame.isStalemate() || chessGame.isThreefoldRepetition()) {
				handleGameOver(1, 2, "DRAW");
			}
		}
	}, [chessPosition, onTurnChange, chessGame]);

	function makeRandomMove() {
		const possibleMoves = chessGame.moves();

		if (chessGame.isGameOver()) {
			return;
		}

		const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
		chessGame.move(randomMove);
		setChessPosition(chessGame.fen());
	}

	function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
		if (!targetSquare) {
			return false;
		}

		try {
			chessGame.move({
				from: sourceSquare,
				to: targetSquare,
				promotion: "q",
			});

			setChessPosition(chessGame.fen());
			setTimeout(makeRandomMove, 500);
			return true;
		} catch {
			return false;
		}
	}

	const chessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		id: "play-vs-random",
		lightSquareStyle: {
			backgroundColor: "var(--color-board-light)",
		},
		darkSquareStyle: {
			backgroundColor: themeArray[state.user?.boardTheme ? state.user?.boardTheme - 1 : 0]?.background,
		},
	};

	return <Chessboard options={chessboardOptions} />;
}
