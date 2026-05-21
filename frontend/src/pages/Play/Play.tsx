import { useEffect, useState } from "react";
import { Board, PlayerHeader, MatchSidebar } from "../../components";
import type { PieceColor } from "../../components/Board/Board";
import { useAuth } from "../../contexts/UserContext";
import { useGame } from "../../contexts/GameContext/GameContext";
import { MatchmakingLoading } from "../../components/MatchMaking/MatchMakingLoading";
import { GameOverModal } from "../../components/GameModals/GameOverModal";
import { GameActions } from "../../components/Board/GameActions";
import { ConfirmationModal } from "../../components/GameModals/ConfirmationModal";
import chess from "../../assets/chess-pieces.png";
import cat from "../../assets/cat.jpg";
import cloud from "../../assets/sky.jpg";

const BACKGROUND_THEMES: Record<number, string> = {
	1: chess,
	2: cat,
	3: cloud,
};

export function Play() {
	const { state } = useAuth();
	const [currentTurn, setCurrentTurn] = useState<PieceColor>("w");
	const [timerKey, setTimerKey] = useState(0);
	const { gameId, isConnected, color, opponentId, drawProposal, handleDrawResponse } = useGame();

	useEffect(() => {
		setTimerKey((prevKey) => prevKey + 1);
	}, [currentTurn]);

	const handleTurnChange = (newTurn: PieceColor) => {
		setCurrentTurn(newTurn);
	};

	if (!gameId) {
		return <MatchmakingLoading isConnected={isConnected} />;
	}

	const userThemeId = state.user?.backgroundTheme || 1;

	const selectedBackground = BACKGROUND_THEMES[userThemeId] || chess;

	return (
		// <div className="min-h-[calc(100vh-5rem)] bg-stone-800 font-sans flex flex-col items-center py-4 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
		<div
			className="min-h-[calc(100vh-5rem)] bg-stone-800 font-sans flex flex-col items-center py-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
			style={{ backgroundImage: "url(" + selectedBackground + ")" }}>
				{drawProposal && (
				<ConfirmationModal
					title="Draw?"
					description="The opponent wants to play again. Do you accept the challenge?"
					icon="🔄"
					confirmLabel="Accept"
					cancelLabel="Decline"
					onResponse={handleDrawResponse}
					variant="info"
				/>
			)}
			{/* GameOver */}
			<GameOverModal />
			<div className="relative z-10 w-fit mx-auto grid grid-cols-1 xl:grid-cols-[auto_22rem] xl:grid-rows-[auto_1fr] gap-4 items-start px-4">
				{/* PlayerHeader */}
				<div className="flex justify-center xl:col-start-1 xl:row-start-1">
					<PlayerHeader
						currentTurn={currentTurn}
						color={color}
						state={state}
						timerKey={timerKey}
						opponentId={opponentId}
						className="max-w-[calc(100vh-5rem)]"
					/>
				</div>
				{/* Board */}
				<section className="flex items-center justify-center w-full max-h-screen xl:col-start-1 xl:row-start-2">
					<div className="p-3 sm:p-5 bg-stone-900 max-w-[calc(100vh-15rem)] rounded-xl border border-stone-700 shadow-md">
						<Board onTurnChange={handleTurnChange} />
					</div>
				</section>
				{/* MatchSidebar: one instance; below board on narrow viewports, right column on xl */}
				<div className="flex w-full flex-col rounded-xl xl:col-start-2 xl:row-start-1 xl:row-span-2 xl:min-h-0">
					<div className="flex min-h-0 flex-col xl:h-[calc(100vh)] xl:max-h-[calc(100vh-7rem)]">
						<MatchSidebar />
						<div className="flex max-w align-middle justify-center">
							<GameActions />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
