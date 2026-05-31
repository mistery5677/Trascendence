import { useEffect, useState } from "react";
import { Timer } from "../index";
import type { PieceColor } from "../Board/Board";
import type { AuthState } from "../../contexts/UserContext/authTypes";
import type { PlayerData } from "../../api/PlayerDataType";
import { getOpponentData } from "../../api/users";

type PlayerHeaderProps = {
	currentTurn: PieceColor;
	color: "w" | "b" | null;
	state: AuthState;
	className?: string | undefined;
	opponentId?: string | null;

	myTimeLeft: number;
	opponentTimeLeft: number;
	onTimeOut: (loserColor: "w" | "b") => void; // Warns who lost the game
};

export function PlayerHeader({
	currentTurn,
	color,
	state,
	opponentId,
	className = "",
	myTimeLeft,
	opponentTimeLeft,
	onTimeOut,
}: PlayerHeaderProps) {
	const [opponentProfile, setOpponentProfile] = useState<PlayerData | null>(null);
	useEffect(() => {
		if (!opponentId || String(opponentId).startsWith("bot_")) {
			return;
		}

		let cancelled = false;
		getOpponentData(opponentId)
			.then((data) => {
				if (!cancelled) setOpponentProfile(data);
			})
			.catch(() => {
				if (!cancelled) setOpponentProfile(null);
			});

		return () => {
			cancelled = true;
		};
	}, [opponentId]);

	const opponentDisplayName = opponentProfile?.username ?? opponentId ?? "Opponent";

	const opponentAvatarUrl = opponentProfile?.avatarUrl ? opponentProfile?.avatarUrl : undefined;

	const isMyTurn = color != null && currentTurn === color;
	const isOpponentTurn = color != null && currentTurn !== color;

	return (
		<div
			className={`grid w-full grid-cols-[1fr_auto_1fr] items-center gap-[2%] rounded-2xl border border-emerald-300/15 bg-stone-900/70 p-[2.5%] text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm ${className}`}>
			{/* left user */}
			<div
				className={`flex w-full min-w-0 items-center gap-[3%] rounded-2xl p-[3%] transition-all duration-500 justify-self-start ${
					color != null && currentTurn === color
						? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[.90] hover:scale-[1.05]"
						: "opacity-65 scale-100"
				}`}>
				{/* avatar */}
				<img
					src={state.user?.avatarUrl}
					className={`aspect-square w-[34%] md:w-[20%] shrink-0 rounded-full object-cover shadow-lg ring-2 transition-all duration-500 ${
						color != null && currentTurn === color
							? "ring-emerald-300 shadow-emerald-700/20"
							: "ring-slate-700 shadow-none border border-slate-600"
					}`}
				/>
				{/* name & rank + timer */}
				<div className="max-w-[80%] md:flex items-center flex-nowrap gap-[4%] flex-1 min-w-0">
					<div className="flex flex-col justify-center items-start overflow-hidden flex-1 min-w-0">
						<div
							className={`truncate w-full text-[clamp(0.85rem,1.15vw,2.5rem)] font-extrabold transition-colors duration-500 ${
								color != null && currentTurn === color ? "text-stone-100" : "text-slate-400"
							}`}>
							{state.user ? state.user?.username : "Player 1"}
						</div>
						<div
							className={`truncate w-full text-[clamp(0.65rem,0.75vw,1rem)] font-semibold tracking-wide transition-colors duration-500 ${
								color != null && currentTurn === color ? "text-emerald-300" : "text-slate-500"
							}`}>
							GRANDMASTER
						</div>
					</div>
					<div className="shrink-0">
						<Timer
							timeLeftInSeconds={myTimeLeft}
							isRunning={isMyTurn}
							onTimeUp={() => {
								if (color) onTimeOut(color);
							}}
						/>
					</div>
				</div>
			</div>

			{/* VS — diamond plate + gradient type */}
			<div className="flex w-full flex-col items-center justify-self-center shrink-0">
				<span className="mb-[8%] text-[clamp(0.6rem,0.8vw,2.95rem)] font-bold tracking-widest text-slate-500">
					MATCH
				</span>
				<div className="relative flex aspect-square w-[65%] items-center justify-center">
					<div
						className="absolute inset-0 rotate-45 rounded-md border border-emerald-400/35 bg-linear-to-br from-stone-800/90 to-stone-950/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
						aria-hidden
					/>
					<span className="relative z-10 bg-linear-to-br from-emerald-200 via-emerald-400 to-teal-500 bg-clip-text text-[90%] font-black italic leading-none text-transparent drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]">
						VS
					</span>
				</div>
			</div>

			{/* right user */}
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
		</div>
	);
}
