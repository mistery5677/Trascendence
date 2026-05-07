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
		<div className="min-h-[calc(100vh-5rem)] bg-stone-800 to-slate-900 font-sans flex flex-col items-center py-12 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
			{/* Ambient Glowing Background */}
			<div className="absolute inset-0 pointer-events-none z-0 opacity-20">
				<div className="absolute top-[20%] -left-[10%] w-[36vw] h-[36vw] bg-emerald-700/20 rounded-full blur-[110px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-emerald-500/12 rounded-full blur-[95px]"></div>
			</div>
			{/* GameOver */}
			<GameOverModal />
			<div className="relative z-10 w-full max-w-7xl grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_26rem] xl:grid-rows-[auto_1fr] gap-8 items-start px-4">
				{/* PlayerHeader */}
				<div className="xl:col-span-1">
					<PlayerHeader
						currentTurn={currentTurn}
						color={color}
						state={state}
						timerKey={timerKey}
					/>
				</div>

				{/* MatchSidebar */}
				<div className="hidden xl:flex flex-col rounded-2xl shadow-md row-span-2 h-full">
					<MatchSidebar />
				</div>

				{/* Board */}
				<div className="p-3 sm:p-6 bg-stone-900/75 rounded-2xl border border-emerald-300/15 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/5 backdrop-blur-md">
					<Board onTurnChange={handleTurnChange} />
				</div>

				<div className="block xl:hidden w-full">
					<MatchSidebar />
				</div>

				{/* GameActions */}
				<div className="xl:col-span-2">
					<GameActions />
				</div>
			</div>
		</div>
	);
}
