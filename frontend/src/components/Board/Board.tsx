import { Chessboard } from "react-chessboard";
import { useRef, useEffect } from "react";
import { Chess } from "chess.js";
import { useState } from "react";

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

export function Board({ onTurnChange }: BoardProps) {
	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;

	const [chessPosition, setChessPosition] = useState(chessGame.fen());

	useEffect(() => {
		if (onTurnChange) {
			onTurnChange(chessGame.turn());
		}

		// Check if the game is finished
		if (chessGame.isGameOver()){
			console.log("Match finished");

			if (chessGame.isCheckmate()){
				// If the black ('b') is playing and has check-mate, whites win
				const result = chessGame.turn() === 'b' ? 'PLAYER_A_WINS' : 'PLAYER_B_WINS';

				// Call handle game over and use tests id
				handleGameOver(1, 2, result);
			}
			else if (chessGame.isDraw() || chessGame.isStalemate() || chessGame.isThreefoldRepetition()){
				handleGameOver(1, 2, 'DRAW');
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
			backgroundColor: "var(--color-board-dark)",
		},
	};

	return <Chessboard options={chessboardOptions} />;
}
