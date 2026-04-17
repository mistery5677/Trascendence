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
