import { useEffect, useState } from "react";
import { Board, PlayerHeader, MatchSidebar } from "../../components";
import type { PieceColor } from "../../components/Board/Board";
import { useAuth } from "../../contexts/UserContext";
import { useGame } from "../../contexts/GameContext/GameContext";
import { MatchmakingLoading } from "../../components/MatchMaking/MatchMakingLoading";
import { GameOverModal } from "../../components/GameOver/GameOverModal";
import { GameActions } from "../../components/Board/GameActions";

export function Play() {
	const { state } = useAuth();
	const [currentTurn, setCurrentTurn] = useState<PieceColor>("w");
	const [timerKey, setTimerKey] = useState(0); // Key to force timer reset
	const { gameId, isConnected, color } = useGame();
	// We create a 'state' to store te game result

	useEffect(() => {
		setTimerKey((prevKey) => prevKey + 1);
	}, [currentTurn]);

	const handleTurnChange = (newTurn: PieceColor) => {
		setCurrentTurn(newTurn);
	};

	if (!gameId) {
		return <MatchmakingLoading isConnected={isConnected} />;
	}

	return (
		<div className="min-h-[calc(100vh-5rem)] bg-stone-800 font-sans flex flex-col items-center py-4 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
			{/* GameOver */}
			<GameOverModal />
			<div className="relative z-10 w-fit mx-auto grid grid-cols-1 xl:grid-cols-[auto_22rem] xl:grid-rows-[auto_1fr] gap-4 items-start px-4">
				{" "}
				{/* max-h-[calc(100vh-10rem)] */}
				{/* PlayerHeader */}
				<div className="xl:col-span-1 flex justify-center">
					<PlayerHeader
						currentTurn={currentTurn}
						color={color}
						state={state}
						timerKey={timerKey}
						className="max-w-[calc(100vh-5rem)]"
					/>
				</div>
				{/* MatchSidebar */}
				<div className="hidden xl:flex flex-col rounded-xl row-span-2">
					<div className="h-[calc(100vh-14rem)] max-h-[calc(100vh-10rem)]">
						<MatchSidebar />
						{/* GameActions */}
						<div className="xl:col-span-2">
							<GameActions />
						</div>
					</div>
				</div>
				{/* Board */}
				<section className="flex items-center justify-center w-full max-h-screen">
					<div className="p-3 sm:p-5 bg-stone-900 max-w-[calc(100vh-15rem)] rounded-xl border border-stone-700 shadow-md">
						<Board onTurnChange={handleTurnChange} />
					</div>
				</section>
				<div className="block xl:hidden w-full">
					<MatchSidebar />
				</div>
			</div>
		</div>
	);
}
