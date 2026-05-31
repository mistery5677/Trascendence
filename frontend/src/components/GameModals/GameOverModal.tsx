import { useGame } from "../../contexts/GameContext/GameContext";

export function GameOverModal() {
	const { gameOver, color, proposeRematch } = useGame();

	if (!gameOver) return null;

	const isWinner = gameOver.winnerColor === color;
	const isDraw = gameOver.winnerColor === null;
	console.log(gameOver.winnerColor);

	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 px-[4%] backdrop-blur-md animate-in fade-in duration-500">
			<div className="flex w-full max-w-[min(92vw,38rem)] -translate-y-[18%] flex-col items-center gap-[clamp(1rem,2.5vw,1.5rem)] rounded-[clamp(1rem,2vw,1.5rem)] border border-emerald-500/30 bg-slate-900 p-[clamp(1.25rem,4vw,2.5rem)] text-center shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)] transition-all sm:translate-y-0">
				<h2 className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-[clamp(2rem,7vw,3.5rem)] font-black text-transparent">
					{isDraw ? "DRAW" : isWinner ? "VICTORY!" : "DEFEAT"}
				</h2>

				<p className="max-w-[32ch] text-[clamp(0.95rem,2.5vw,1.125rem)] text-slate-400">
					{isDraw
						? "A tough battle with no clear winner."
						: isWinner
							? "You crushed the opponent! +8 ELO"
							: "Better luck next time. -8 ELO"}
				</p>

				<span className="text-[clamp(0.7rem,1.8vw,0.8rem)] font-mono uppercase tracking-[0.25em] text-emerald-500/50">
					Reason: {gameOver.reason}
				</span>

				<div className="mt-2 flex w-full flex-col gap-3 sm:mt-4 sm:flex-row">
					<button
						onClick={() => (window.location.href = "/play")}
						className="w-full rounded-xl bg-emerald-500 px-[clamp(1rem,2.5vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.9rem,2vw,1rem)] font-bold text-slate-950 transition-all hover:bg-emerald-400 sm:flex-1">
						Play Again
					</button>
					<button
						onClick={() => (window.location.href = "/play")}
						className="w-full rounded-xl bg-emerald-500 px-[clamp(1rem,2.5vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.9rem,2vw,1rem)] font-bold text-slate-950 transition-all hover:bg-emerald-400 sm:flex-1">
						Rematch
					</button>
					<a
						href="/settings"
						className="w-full rounded-xl border border-slate-600 bg-slate-800 px-[clamp(1rem,2.5vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] text-[clamp(0.9rem,2vw,1rem)] font-bold text-white transition-all hover:bg-slate-700 sm:flex-1">
						View Stats
					</a>
				</div>
			</div>
		</div>
	);
}
