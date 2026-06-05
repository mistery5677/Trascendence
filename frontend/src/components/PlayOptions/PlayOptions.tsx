import { useEffect, useState } from "react";
import penguinBot from "../../assets/penguin-pudgy.gif";
import penguinPlayer from "../../assets/penguin-player.gif";
import { useGame } from "../../contexts/GameContext/GameContext";
import { toastWrapper } from "../../adapters/toastWrapper";
import { MatchOptions } from "../MatchOptions/MatchOptions";

export function PlayOptions() {
	const [expandedOption, setExpandedOption] = useState<"bot" | "player" | null>(null);
	const [botMatchTime, setBotMatchTime] = useState("5 min");
	const [playerMatchTime, setPlayerMatchTime] = useState("5 min");
	const [pendingStart, setPendingStart] = useState<{ mode: "bot" | "player"; time: string } | null>(null);

	useEffect(() => {
		(window as { Tenor?: { Embed?: { load?: () => void } } }).Tenor?.Embed?.load?.();
	}, []);

	const { startOnlineGame, startBotGame, gameId, surrender } = useGame();

	useEffect(() => {
		if (!pendingStart || gameId) return;

		if (pendingStart.mode === "bot") {
			startBotGame({ time: pendingStart.time });
		} else {
			startOnlineGame({ time: pendingStart.time });
		}

		setPendingStart(null);
	}, [pendingStart, gameId, startBotGame, startOnlineGame]);

	const handleStartRequest = (mode: "bot" | "player", time: string) => {
		if (!gameId) {
			if (mode === "bot") {
				toastWrapper.success("Uncle Carlsen is taking his seat...");
				startBotGame({ time });
			} else {
				startOnlineGame({ time });
			}
			return;
		}

		toastWrapper.confirm("You are currently in a match. To continue, do you want to surrender this game?", {
			onAccept: () => {
				setPendingStart({ mode, time });
				surrender();
			},
			acceptLabel: "Surrender & Continue",
			rejectLabel: "Keep Current Match",
		});
	};

	const handleStartOnline = () => {
		toastWrapper.success(`Searching for ${playerMatchTime} match...`);
		handleStartRequest("player", playerMatchTime);
	};

	const handleStartBotGame = () => {
		handleStartRequest("bot", botMatchTime);
	};

	const toggleExpandedOption = (option: "bot" | "player") => {
		setExpandedOption((prev) => (prev === option ? null : option));
	};

	return (
		<div className="flex w-full flex-col items-center justify-center gap-3 pt-0">
			<div
				className={`w-full overflow-hidden rounded-2xl border bg-linear-to-br from-stone-900 via-stone-850 to-stone-900 shadow-[0_18px_34px_-20px_rgba(0,0,0,0.9)] transition-all duration-300 hover:shadow-[0_24px_36px_-18px_rgba(16,185,129,0.28)] ${
					expandedOption === "bot"
						? "border-emerald-400 shadow-[0_24px_36px_-18px_rgba(16,185,129,0.28)]"
						: "border-emerald-300/35 hover:border-emerald-300/55"
				}`}>
				<button
					type="button"
					onClick={() => toggleExpandedOption("bot")}
					className="group relative isolate w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
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

						<div className="relative flex w-24 shrink-0 items-center justify-center overflow-hidden border-l border-emerald-300/20 bg-stone-950/50 sm:w-40">
							<img
								className="h-full w-full"
								src={penguinBot}
								alt="Penguin emoji"
							/>
						</div>
					</div>
				</button>

				<div
					className={`grid transition-all duration-300 ${
						expandedOption === "bot" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
					}`}>
					<div className="overflow-hidden border-t border-emerald-300/20 bg-stone-950/35">
						<div className="p-4 sm:p-5">
							<MatchOptions
								selectedTime={botMatchTime}
								onSelectTime={setBotMatchTime}
							/>
							<button
								type="button"
								onClick={handleStartBotGame}
								className="mt-3 w-full rounded-xl border border-emerald-300/35 bg-button-green px-4 py-2.5 text-sm font-bold tracking-wide text-emerald-100 transition-colors hover:bg-green-600 sm:text-base">
								Play Bot Match
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className={`w-full overflow-hidden rounded-2xl border bg-linear-to-br from-stone-900 via-stone-850 to-stone-900 shadow-[0_18px_34px_-20px_rgba(0,0,0,0.9)] transition-all duration-300 hover:shadow-[0_24px_36px_-18px_rgba(16,185,129,0.28)] ${
					expandedOption === "player"
						? "border-emerald-400 shadow-[0_24px_36px_-18px_rgba(16,185,129,0.28)]"
						: "border-emerald-300/35 hover:border-emerald-300/55"
				}`}>
				<button
					type="button"
					onClick={() => toggleExpandedOption("player")}
					className="group relative isolate w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900">
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

						<div className="relative flex w-24 shrink-0 items-center justify-center overflow-hidden border-l border-emerald-300/20 bg-stone-950/50 sm:w-40">
							<img
								className="h-full w-full"
								src={penguinPlayer}
								alt=""
							/>
						</div>
					</div>
				</button>

				<div
					className={`grid transition-all duration-300 ${
						expandedOption === "player" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
					}`}>
					<div className="overflow-hidden border-t border-emerald-300/20 bg-stone-950/35">
						<div className="p-4 sm:p-5">
							<MatchOptions
								selectedTime={playerMatchTime}
								onSelectTime={setPlayerMatchTime}
							/>
							<button
								type="button"
								onClick={handleStartOnline}
								className="mt-3 w-full rounded-xl border border-emerald-300/35 bg-button-green px-4 py-2.5 text-sm font-bold tracking-wide text-emerald-100 transition-colors hover:bg-green-600 sm:text-base">
								Find Match
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
