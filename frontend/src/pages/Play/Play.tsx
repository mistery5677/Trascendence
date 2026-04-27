import { useEffect, useState } from "react";
import { Board, Timer } from "../../components";
import type { PieceColor } from "../../components/Board/Board";
import { useAuth } from "../../contexts/UserContext";

export function Play() {
	const { state } = useAuth();
	const [currentTurn, setCurrentTurn] = useState<PieceColor>("w");
	const [timerKey, setTimerKey] = useState(0); // Key to force timer reset

	// We create a 'state' to store te game result
	const [gameResult, setGameResult] = useState<string | null>(null);

	useEffect(() => {
		setTimerKey((prevKey) => prevKey + 1);
	}, [currentTurn]);

	const handleTurnChange = (newTurn: PieceColor) => {
		setCurrentTurn(newTurn);
	};

	const handleGameOver = (result: string) => {
		setGameResult(result);
	};

	return (
		<div className="min-h-[calc(100vh-5rem)] bg-linear-to-b from-slate-950 via-stone-950 to-slate-900 font-sans flex flex-col items-center py-12 relative overflow-hidden">
			{/* Ambient Glowing Background */}
			<div className="absolute inset-0 pointer-events-none z-0 opacity-20">
				<div className="absolute top-[20%] -left-[10%] w-[36vw] h-[36vw] bg-emerald-700/20 rounded-full blur-[110px]"></div>
				<div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-emerald-500/12 rounded-full blur-[95px]"></div>
			</div>
			{gameResult && (
				<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
					<div className="bg-slate-900 border border-emerald-500/30 p-10 rounded-3xl flex flex-col items-center gap-6 shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)] transform transition-all scale-105">
						<h2 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">
							{gameResult === "PLAYER_A_WINS"
								? "VICTORY!"
								: gameResult === "PLAYER_B_WINS"
									? "DEFEAT"
									: "DRAW"}
						</h2>

						<p className="text-slate-400 text-lg">
							{gameResult === "PLAYER_A_WINS"
								? "You crushed the bot! +8 ELO"
								: gameResult === "PLAYER_B_WINS"
									? "Better luck next time. -8 ELO"
									: "A tough battle with no clear winner."}
						</p>

						<div className="flex gap-4 mt-4">
							<button
								onClick={() => window.location.reload()}
								className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all">
								Play Again
							</button>
							<a
								href="/settings"
								className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded-xl transition-all">
								View Stats
							</a>
						</div>
					</div>
				</div>
			)}
			<div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center h-full gap-8 px-4">
				{/* Player vs Player Header Area */}
				<div className="flex flex-row text-white w-full justify-between items-center bg-slate-900/70 p-4 sm:p-6 rounded-2xl border border-emerald-300/15 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm">
					{/* left user */}
					<div
						className={`flex flex-row items-center gap-3 sm:gap-4 p-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-500 ${
							currentTurn === "w"
								? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
								: "opacity-65 scale-100"
						}`}>
						{/* image */}
						<img
							src={state.user?.avatarUrl}
							className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-4 object-fill shadow-lg transition-all duration-500 ${
								currentTurn === "w"
									? "ring-emerald-300 shadow-emerald-700/20"
									: "ring-slate-700 shadow-none border border-slate-600"
							}`}></img>
						{/* user name & rank */}
						<div className="flex flex-col justify-center items-start">
							<div
								className={`font-extrabold text-lg sm:text-xl transition-colors duration-500 ${currentTurn === "w" ? "text-stone-100" : "text-slate-400"}`}>
								{state.user ? state.user?.username : "Player 1"}
							</div>
							<div
								className={`font-bold text-xs sm:text-sm tracking-wide transition-colors duration-500 ${currentTurn === "w" ? "text-emerald-300" : "text-slate-500"}`}>
								GRANDMASTER
							</div>
						</div>
					</div>
					<Timer
						key={timerKey}
						startTimerInSeconds={30}
						isRunning={currentTurn === "w"}
					/>

					{/* VS / result */}
					<div className="flex flex-col items-center px-1 sm:px-2 shrink-0">
						<span className="text-[10px] sm:text-xs text-slate-500 font-bold tracking-widest mb-1">
							MATCH
						</span>
						<div className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-teal-300">
							VS
						</div>
					</div>

					<Timer
						key={timerKey + 1}
						startTimerInSeconds={30}
						isRunning={currentTurn === "b"}
					/>

					{/* right user */}
					<div
						className={`flex flex-row items-center gap-3 sm:gap-4 p-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-500 ${
							currentTurn === "b"
								? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
								: "opacity-65 scale-100"
						}`}>
						{/* user name & rank */}
						<div className="hidden sm:flex sm:flex-col sm:justify-center sm:items-end">
							<div
								className={`font-extrabold text-lg sm:text-xl transition-colors duration-500 ${currentTurn === "b" ? "text-stone-100" : "text-slate-400"}`}>
								Opponent
							</div>
							<div
								className={`font-bold text-xs sm:text-sm tracking-wide transition-colors duration-500 ${currentTurn === "b" ? "text-emerald-300" : "text-slate-500"}`}>
								BEGINNER
							</div>
						</div>
						{/* image */}
						<div
							className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-800 flex items-center justify-center ring-4 text-2xl sm:text-3xl shadow-lg transition-all duration-500 ${
								currentTurn === "b"
									? "ring-emerald-300 shadow-emerald-700/20 opacity-100"
									: "ring-slate-700 shadow-none border border-slate-600"
							}`}>
							🤖
						</div>
					</div>
				</div>

				{/* Board */}
				<div className="w-full max-w-2xl px-2">
					<div className="p-3 sm:p-6 bg-slate-900/75 rounded-2xl border border-emerald-300/15 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/5 backdrop-blur-md">
						<Board
							onTurnChange={handleTurnChange}
							onGameOver={handleGameOver}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
