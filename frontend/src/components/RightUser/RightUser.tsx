import { Timer } from "../Timer/Timer";

type RightUserProps = {
	color: "w" | "b" | null;
	currentTurn: "w" | "b";
	onTimeOut: (loserColor: "w" | "b") => void;
	opponentDisplayName: string;
	opponentTimeLeft: number;
	isOpponentTurn: boolean;
	opponentAvatarUrl: string | undefined;
};

export function RightUser({
	color,
	currentTurn,
	onTimeOut,
	opponentDisplayName,
	opponentTimeLeft,
	isOpponentTurn,
	opponentAvatarUrl,
}: RightUserProps) {
	return (
		<>
			<div
				className={`flex w-full min-w-0 items-center gap-[3%] rounded-2xl p-[3%] justify-end justify-self-end transition-all duration-500 ${
					color != null && currentTurn !== color
						? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[.90] hover:scale-[1.05]"
						: "opacity-65 scale-100"
				}`}>
				{/* timer + name & rank */}
				<div className="flex flex-col items-end gap-[1%] flex-1 min-w-0 justify-end md:flex-row-reverse md:items-center md:gap-[4%]">
					<div className="flex flex-col justify-center items-end overflow-hidden flex-1 min-w-0">
						<div
							className={`truncate w-full text-right text-[clamp(0.85rem,1.15vw,2.5rem)] font-extrabold transition-colors duration-500 ${
								color != null && currentTurn !== color ? "text-stone-100" : "text-slate-400"
							}`}>
							{opponentDisplayName}
						</div>
						<div
							className={`truncate w-full text-right text-[clamp(0.65rem,0.75vw,1rem)] font-semibold tracking-wide transition-colors duration-500 ${
								color != null && currentTurn !== color ? "text-emerald-300" : "text-slate-500"
							}`}>
							BEGINNER
						</div>
					</div>
					<div className="shrink-0">
						<Timer
							timeLeftInSeconds={opponentTimeLeft}
							isRunning={isOpponentTurn}
							onTimeUp={() => {
								const opponentColor = color === "w" ? "b" : "w";
								onTimeOut(opponentColor);
							}}
						/>
					</div>
				</div>
				{/* avatar */}
				<img
					src={opponentAvatarUrl}
					className={`aspect-square w-[34%] md:w-[20%] shrink-0 rounded-full object-cover shadow-lg ring-2 transition-all duration-500 ${
						color != null && currentTurn !== color
							? "ring-emerald-300 shadow-emerald-700/20"
							: "ring-slate-700 shadow-none border border-slate-600"
					}`}
				/>
			</div>
		</>
	);
}
