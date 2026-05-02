import { Chessboard, fenStringToPositionObject } from "react-chessboard";
import { useRef, useEffect } from "react";
import { Chess } from "chess.js";
import { useState } from "react";
import { handleGameOver } from "../../api/matches";
import { useAuth } from "../../contexts/UserContext";
import { useGame } from "../../contexts/GameContext/GameContext";
import { ChartNoAxesColumnIcon } from "lucide-react";

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
  const { state } = useAuth();
  const themeArray = [themes.forest, themes.classic, themes.midnight];

  const chessGameRef = useRef(new Chess());
  const chessGame = chessGameRef.current;

  const [chessPosition, setChessPosition] = useState(chessGame.fen());

  const { socket, gameId, color, fen, currentTurn } = useGame();

  useEffect(() => {
    if (!socket || !gameId) return;
    chessGame.load(fen);
    setChessPosition(fen);
    if (onTurnChange) onTurnChange(currentTurn);
  }, [fen, currentTurn]);

  function onPieceDrop({ sourceSquare, targetSquare }: PieceDropHandlerArgs) {
    console.log("My color:", color);
    console.log("currentTurn:", currentTurn);

    if (!gameId || !socket || currentTurn !== color) return false;

    if (chessGame.turn() !== color || chessGame.isGameOver()) return false;

    if (!targetSquare) {
      return false;
    }

    const moveData = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    };

    try {
      const move = chessGame.move(moveData);
      if (!move) return false;

      socket.emit("move", { gameId, move: moveData });

      setChessPosition(chessGame.fen());
      return true;
    } catch {
      return false;
    }
  }

  const chessboardOptions = {
    position: chessPosition,
    onPieceDrop,
    id: "play-vs-random",
    boardOrientation: color === "b" ? "black" : "white",
    lightSquareStyle: {
      backgroundColor: "var(--color-board-light)",
    },
    darkSquareStyle: {
      backgroundColor:
        themeArray[state.user?.boardTheme ? state.user?.boardTheme - 1 : 0]
          ?.background,
    },
  };

  return <Chessboard options={chessboardOptions} />;
}
