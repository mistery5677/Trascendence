import { useEffect } from "react";
import penguinBot from "../../assets/penguin-pudgy.gif";
import penguinPlayer from "../../assets/pengu-player.gif";
import { useGame } from "../../contexts/GameContext/GameContext";
import { toastWrapper } from "../../adapters/toastWrapper";

export function PlayOptions() {
	useEffect(() => {
		(window as { Tenor?: { Embed?: { load?: () => void } } }).Tenor?.Embed?.load?.();
	}, []);

	const { startOnlineGame, startBotGame } = useGame();

	const handleVsPlayer = () => {
		toastWrapper.success("OK OK OK");
		startOnlineGame();
	};

	return (
		<div className="flex w-full flex-col items-center justify-center gap-3">
			<button
				type="button"
				onClick={startBotGame}
				className="group relative isolate w-full overflow-hidden rounded-2xl border border-emerald-300/35 bg-linear-to-br from-stone-900 via-stone-850 to-stone-900 text-left shadow-[0_18px_34px_-20px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/55 hover:shadow-[0_24px_36px_-18px_rgba(16,185,129,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
				<span className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-emerald-400/20 to-transparent sm:w-28" />

				<div className="relative z-10 flex min-h-30 items-stretch">
					<div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
						<div>
							<p className="text-[10px] font-semibold tracking-[0.18em] text-emerald-200/70 uppercase">
								Solo challenge
							</p>
							<h3 className="mt-1 text-lg font-extrabold tracking-wide text-emerald-100 sm:text-xl">
								PLAY VS BOT
							</h3>
						</div>
						<p className="mt-2 max-w-[20ch] text-sm leading-snug text-stone-300/95">
							Your quick arena for practice, openings, and warm-up games.
						</p>
					</div>

					<div className="relative flex w-24 shrink-0 items-center justify-center overflow-hidden border-l border-emerald-300/20 bg-stone-950/50  sm:w-40 ">
						<img
							className="w-full h-full"
							src={penguinBot}
							alt=""
						/>
					</div>
				</div>
			</button>

			<button
				type="button"
				onClick={handleVsPlayer}
				className="group relative isolate w-full overflow-hidden rounded-2xl border border-emerald-300/35 bg-linear-to-br from-stone-900 via-stone-850 to-stone-900 text-left shadow-[0_18px_34px_-20px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/55 hover:shadow-[0_24px_36px_-18px_rgba(16,185,129,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
				<span className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-emerald-400/20 to-transparent sm:w-28" />

				<div className="relative z-10 flex min-h-30 items-stretch">
					<div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
						<div>
							<p className="text-[10px] font-semibold tracking-[0.18em] text-emerald-200/70 uppercase">
								Head to head
							</p>
							<h3 className="mt-1 text-lg font-extrabold tracking-wide text-emerald-100 sm:text-xl">
								PLAY VS PLAYER
							</h3>
						</div>
						<p className="mt-2 max-w-[20ch] text-sm leading-snug text-stone-300/95">
							Challenge a friend and battle live in a pure skill matchup.
						</p>
					</div>

					<div className="relative flex w-24 shrink-0 items-center justify-center overflow-hidden border-l border-emerald-300/20 bg-stone-950/50  sm:w-40 ">
						<img
							className="w-full h-full"
							src={penguinPlayer}
							alt=""
						/>
					</div>
				</div>
			</button>
		</div>
	);
}
