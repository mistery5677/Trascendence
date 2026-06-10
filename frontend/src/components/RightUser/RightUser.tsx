import { Timer } from "../Timer/Timer";

type RightUserProps = {
	color: "w" | "b" | null;
	currentTurn: "w" | "b";
	onTimeOut: (loserColor: "w" | "b") => void;
	opponentDisplayName: string;
	opponentTimeLeft: number;
	isOpponentTurn: boolean;
	opponentAvatarUrl: string | undefined;
	isSearchingMatch?: boolean;
};

export function RightUser({
	color,
	currentTurn,
	onTimeOut,
	opponentDisplayName,
	opponentTimeLeft,
	isOpponentTurn,
	opponentAvatarUrl,
	isSearchingMatch = false,
}: RightUserProps) {
	const showSearchingState = isSearchingMatch;

	return (
		<>
			<div
				className={`flex w-full min-w-0 items-center gap-[3%] rounded-2xl p-[3%] justify-end justify-self-end transition-all duration-500 ${
					showSearchingState
						? "bg-emerald-500/10 ring-1 ring-emerald-300/25"
						: color != null && currentTurn !== color
							? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[.90] hover:scale-[1.05]"
							: "opacity-65 scale-100"
				}`}>
				{/* timer + name & rank */}
				<div className="flex flex-col items-end gap-[1%] flex-1 min-w-0 justify-end md:flex-row-reverse md:items-center md:gap-[4%]">
					<div className="flex flex-col justify-center items-end flex-1 min-w-0">
						<div className="group relative w-full overflow-visible text-right">
							<div
								className={`truncate w-full max-w-[11ch] sm:max-w-[14ch] md:max-w-full ml-auto text-right text-[clamp(0.72rem,1vw,2.5rem)] font-extrabold transition-colors duration-500 ${
									showSearchingState
										? "text-emerald-100"
										: color != null && currentTurn !== color
											? "text-stone-100"
											: "text-slate-400"
								}`}>
								{showSearchingState ? "Searching..." : opponentDisplayName}
							</div>
							{!showSearchingState && (
								<div className="pointer-events-none absolute bottom-full right-0 mb-2 rounded-md border border-emerald-300/35 bg-stone-900/95 px-2 py-1 text-[15px] font-semibold tracking-wide text-emerald-200 opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:-translate-y-0.5">
									{opponentDisplayName}
								</div>
							)}
						</div>
						<div
							className={`truncate w-full max-w-[11ch] sm:max-w-[14ch] md:max-w-full ml-auto text-right text-[clamp(0.58rem,0.72vw,1rem)] font-semibold tracking-wide transition-colors duration-500 ${
								showSearchingState
									? "text-emerald-300"
									: color != null && currentTurn !== color
										? "text-emerald-300"
										: "text-slate-500"
							}`}>
							{showSearchingState ? "MATCHMAKING" : "BEGINNER"}
						</div>
					</div>
					<div className="shrink-0">
						{showSearchingState ? (
							<div className="flex aspect-square w-[34%] md:w-[20%] items-center justify-center rounded-full border border-emerald-300/30 bg-stone-950/60 shadow-lg">
								<div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-300/25 border-t-emerald-400" />
							</div>
						) : (
							<Timer
								timeLeftInSeconds={opponentTimeLeft}
								isRunning={isOpponentTurn}
								onTimeUp={() => {
									const opponentColor = color === "w" ? "b" : "w";
									onTimeOut(opponentColor);
								}}
							/>
						)}
					</div>
				</div>
				{/* avatar */}
				{showSearchingState ? (
					<div className="flex aspect-square w-[34%] md:w-[20%] shrink-0 items-center justify-center rounded-full border border-emerald-300/30 bg-linear-to-br from-stone-950 to-stone-800 shadow-lg">
						<div className="flex flex-col items-center gap-1 text-center">
							<div className="h-8 w-8 rounded-full border-2 border-emerald-300/25 border-t-emerald-400 animate-spin" />
						</div>
					</div>
				) : (
					<img
						src={opponentAvatarUrl}
						className={`aspect-square w-[34%] md:w-[20%] shrink-0 rounded-full object-fit shadow-lg ring-2 transition-all duration-500 ${
							color != null && currentTurn !== color
								? "ring-emerald-300 shadow-emerald-700/20"
								: "ring-slate-700 shadow-none border border-slate-600"
						}`}
					/>
				)}
			</div>
		</>
	);
}
