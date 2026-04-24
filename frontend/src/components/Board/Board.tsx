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
	onGameOver?: (result:string) => void; // We check if the game is finished
}

export function Board({ onTurnChange, onGameOver }: BoardProps) {
	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;

	const [chessPosition, setChessPosition] = useState(chessGame.fen());

	// Get the current user
	const { state } = useAuth();
	const myUserId = state?.user?.id;

	useEffect(() => {
		if (onTurnChange) {
			onTurnChange(chessGame.turn());
		}

		// Check if the game is finished
		if (chessGame.isGameOver()){
			// We do this verification to pass trought the "handleGameOver" function
			if (myUserId == undefined || onGameOver == undefined)
			{
				console.error("Could not get the id of the current player");
				return ;
			}

			// Check if the game finished with a checkmate
			if (chessGame.isCheckmate()){
				// If the black ('b') is playing and has check-mate, whites win
				const result = chessGame.turn() === 'b' ? 'PLAYER_A_WINS' : 'PLAYER_B_WINS';
				
				handleGameOver(myUserId, 2, result);
				onGameOver(result); // Notify the Play.tsx about the result of the game
				
			}
			else if (chessGame.isDraw() || chessGame.isStalemate() || chessGame.isThreefoldRepetition()){
				handleGameOver(myUserId, 2, 'DRAW');
				onGameOver("DRAW");
			}
		}
	}, [chessPosition, onTurnChange, chessGame, myUserId, onGameOver]);

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
