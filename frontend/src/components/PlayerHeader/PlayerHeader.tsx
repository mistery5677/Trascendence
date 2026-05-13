import { Timer } from "../index";
import type { PieceColor } from "../Board/Board";
import type { AuthState } from "../../contexts/UserContext/authTypes";

type PlayerHeaderProps = {
	currentTurn: PieceColor;
	color: "w" | "b" | null;
	state: AuthState;
	timerKey: number;
	className?: string | undefined;
};

export function PlayerHeader({
	currentTurn,
	color,
	state,
	timerKey,
	className = "",
}: PlayerHeaderProps) {
	return (
		<div
			className={`flex flex-row gap-2 text-white w-full justify-between items-center bg-stone-900/70 p-4 rounded-2xl border border-emerald-300/15 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm ${className}`}
		>
			{/* left user */}
			<div
				className={`flex flex-row items-center gap-2 sm:gap-4 p-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-500 ${
					color != null && currentTurn === color
						? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
						: "opacity-65 scale-100"
				}`}
			>
				{/* image */}
				<img
					src={state.user?.avatarUrl}
					className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-4 object-fill shadow-lg transition-all duration-500 ${
						color != null && currentTurn === color
							? "ring-emerald-300 shadow-emerald-700/20"
							: "ring-slate-700 shadow-none border border-slate-600"
					}`}
				></img>
				{/* user name & rank */}
				<div className="hidden overflow-hidden md:flex flex-col justify-center items-start">
					<div
						className={`hidden md:flex font-extrabold text-lg sm:text-xl transition-colors duration-500 ${
							color != null && currentTurn === color ? "text-stone-100" : "text-slate-400"
						}`}
					>
						{state.user ? state.user?.username : "Player 1"}
					</div>
					<div
						className={`hidden md:flex font-bold text-xs sm:text-sm tracking-wide transition-colors duration-500 ${
							color != null && currentTurn === color ? "text-emerald-300" : "text-slate-500"
						}`}
					>
						GRANDMASTER
					</div>
				</div>
			</div>
			<Timer
				key={timerKey}
				startTimerInSeconds={30}
				isRunning={color != null && currentTurn === color}
			/>

			{/* VS — diamond plate + gradient type */}
			<div className="flex flex-col items-center px-1 sm:px-2 shrink-0">
				<span className="text-[10px] sm:text-xs text-slate-500 font-bold tracking-widest mb-1">MATCH</span>
				<div className="relative flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
					<div
						className="absolute inset-0 rotate-45 rounded-md border border-emerald-400/35 bg-linear-to-br from-stone-800/90 to-stone-950/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
						aria-hidden
					/>
					<span className="relative z-10 font-black italic tabular-nums text-lg leading-none text-transparent sm:text-2xl bg-linear-to-br from-emerald-200 via-emerald-400 to-teal-500 bg-clip-text drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]">
						VS
					</span>
				</div>
			</div>

			<Timer
				key={timerKey + 1}
				startTimerInSeconds={30}
				isRunning={color != null && currentTurn !== color}
			/>

			{/* right user */}
			<div
				className={`flex flex-row items-center gap-3 sm:gap-4 p-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-500 ${
					color != null && currentTurn !== color
						? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
						: "opacity-65 scale-100"
				}`}
			>
				{/* user name & rank */}
				<div className="hidden overflow-hidden md:flex sm:flex-col sm:justify-center sm:items-end">
					<div
						className={`font-extrabold text-lg sm:text-xl transition-colors duration-500 ${
							color != null && currentTurn !== color ? "text-stone-100" : "text-slate-400"
						}`}
					>
						Opponent
					</div>
					<div
						className={`hidden md:flex font-bold text-xs sm:text-sm tracking-wide transition-colors duration-500 ${
							color != null && currentTurn !== color ? "text-emerald-300" : "text-slate-500"
						}`}
					>
						BEGINNER
					</div>
				</div>
				{/* image */}
				<div
					className={`w-[clamp(2rem,10vw,3rem)] h-[clamp(2rem,10vw,3rem)] sm:w-16 sm:h-16 rounded-full bg-slate-800 flex items-center justify-center ring-4 text-[clamp(1rem,5vw,1.5rem)] sm:text-3xl shadow-lg transition-all duration-500 ${
						color != null && currentTurn !== color
							? "ring-emerald-300 shadow-emerald-700/20 opacity-100"
							: "ring-slate-700 shadow-none border border-slate-600"
					}`}
				>
					🤖
				</div>
			</div>
		</div>
	);
}
