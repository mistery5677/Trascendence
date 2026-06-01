import { Chessboard } from "react-chessboard";
import { useRef, useEffect, useCallback, useState } from "react";
import { Chess, type Square } from "chess.js";
import { useAuth } from "../../contexts/UserContext";
import { useGame } from "../../contexts/GameContext/GameContext";
import { loadMoveEffect } from "../../utils/loadMoveEffect";
import { PromotionPicker } from "../PromotionPicker/PromotionPicker";

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

type PromotionPiece = "q" | "r" | "b" | "n";

type PendingPromotion = {
	from: string;
	to: string;
	color: PieceColor;
};

interface BoardProps {
	onTurnChange?: (color: PieceColor) => void;
	onGameOver?: (result: string) => void; // We check if the game is finished
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
	const playMoveEffect = useRef<ReturnType<typeof loadMoveEffect>>(null);

	const { state } = useAuth();
	const themeArray = [themes.forest, themes.classic, themes.midnight];

	const chessGameRef = useRef(new Chess());
	const chessGame = chessGameRef.current;

	const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);

	const { socket, gameId, color, fen, currentTurn } = useGame();

	const [chessPosition, setChessPosition] = useState(() => {
		if (fen && fen !== "start") return fen;
		return chessGame.fen();
	});

	useEffect(() => {
		playMoveEffect.current = loadMoveEffect();
	}, []);

	useEffect(() => {
		if (!fen) return;

		if (fen === "start") {
			chessGame.reset();
			setChessPosition(chessGame.fen());
			if (onTurnChange) onTurnChange("w");
			return;
		}

		try {
			chessGame.load(fen);
			setChessPosition(fen);
		} catch {
			// Ignore malformed FEN payloads to avoid crashing the play page.
			setChessPosition(chessGame.fen());
		}

		if (onTurnChange) onTurnChange(currentTurn);
	}, [fen, currentTurn]);

	const isPromotionMove = useCallback(
		(sourceSquare: string, targetSquare: string) => {
			try {
				const sourcePiece = chessGame.get(sourceSquare as Square);
				if (!sourcePiece || sourcePiece.type !== "p") return false;

				const legalMoves = chessGame.moves({ square: sourceSquare as Square, verbose: true });
				return legalMoves.some((move) => move.to === targetSquare && move.flags.includes("p"));
			} catch {
				return false;
			}
		},
		[chessGame],
	);

	const submitMove = useCallback(
		(from: string, to: string, promotion?: PromotionPiece) => {
			if (!gameId || !socket || currentTurn !== color) return false;
			if (chessGame.turn() !== color || chessGame.isGameOver()) return false;

			const moveData = promotion ? { from, to, promotion } : { from, to };

			try {
				const move = chessGame.move(moveData);
				if (!move) return false;

				if (playMoveEffect.current) {
					playMoveEffect.current();
				}

				socket.emit("move", { gameId, move: moveData });
				setChessPosition(chessGame.fen());
				return true;
			} catch {
				return false;
			}
		},
		[socket, gameId, color, currentTurn, chessGame],
	);

	const onPieceDrop = useCallback(
		({ sourceSquare, targetSquare }: PieceDropHandlerArgs) => {
			if (!gameId || !socket || currentTurn !== color) return false;
			if (chessGame.turn() !== color || chessGame.isGameOver()) return false;

			if (!targetSquare) {
				return false;
			}

			if (isPromotionMove(sourceSquare, targetSquare)) {
				setPendingPromotion({
					from: sourceSquare,
					to: targetSquare,
					color: color === "b" ? "b" : "w",
				});
				return false;
			}

			return submitMove(sourceSquare, targetSquare);
		},
		[socket, gameId, color, currentTurn, chessGame, isPromotionMove, submitMove],
	);

	const onPromotionSelect = useCallback(
		(piece: PromotionPiece) => {
			if (!pendingPromotion) return;

			submitMove(pendingPromotion.from, pendingPromotion.to, piece);
			setPendingPromotion(null);
		},
		[pendingPromotion, submitMove],
	);

	const chessboardOptions = {
		position: chessPosition,
		onPieceDrop,
		allowDragging: Boolean(gameId),
		id: "play-vs-random",
		boardOrientation: color === "b" ? ("black" as const) : ("white" as const),
		lightSquareStyle: {
			backgroundColor: "var(--color-board-light)",
		},
		darkSquareStyle: {
			backgroundColor: themeArray[state.user?.boardTheme ? state.user?.boardTheme - 1 : 0]?.background,
		},
	};

	const returnOpt = {
		id: "play-vs-random",
		boardOrientation: "white" as const,
		lightSquareStyle: {
			backgroundColor: "var(--color-board-light)",
		},
		darkSquareStyle: {
			backgroundColor: themeArray[state.user?.boardTheme ? state.user?.boardTheme - 1 : 0]?.background,
		},
	};

	if (!gameId) return <Chessboard options={returnOpt} />;

	return (
		<>
			<Chessboard options={chessboardOptions} />
			<PromotionPicker
				open={pendingPromotion !== null}
				color={pendingPromotion?.color ?? "w"}
				onSelect={onPromotionSelect}
				onCancel={() => setPendingPromotion(null)}
			/>
		</>
	);
}
