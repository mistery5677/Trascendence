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
	timerKey: number;
	className?: string | undefined;
	opponentId?: string | null;
};

export function PlayerHeader({ currentTurn, color, state, timerKey, opponentId, className = "" }: PlayerHeaderProps) {
	const [opponentProfile, setOpponentProfile] = useState<PlayerData | null>(null);
	useEffect(() => {
		if (!opponentId) {
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

	return (
		<div
			className={`flex w-full items-center justify-between gap-2 rounded-2xl border border-emerald-300/15 bg-stone-900/70 p-2 2xl:p-[3%] text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-3 xl:p-2 ${className}`}>
			{/* left user */}
			<div
				className={`flex items-center gap-1.5 rounded-xl p-1.5 transition-all duration-500 sm:gap-2 sm:p-2 ${
					color != null && currentTurn === color
						? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
						: "opacity-65 scale-100"
				}`}>
				{/* image */}
				<img
					src={state.user?.avatarUrl}
					className={`h-10 w-10 rounded-full object-fill shadow-lg ring-2 transition-all duration-500 sm:h-12 sm:w-12 xl:h-11 xl:w-11 2xl:h-20 2xl:w-20 ${
						color != null && currentTurn === color
							? "ring-emerald-300 shadow-emerald-700/20"
							: "ring-slate-700 shadow-none border border-slate-600"
					}`}></img>
				{/* user name & rank */}
				<div className="hidden min-w-0 overflow-hidden md:flex flex-col justify-center items-start">
					<div
						className={`hidden truncate md:flex text-sm font-extrabold lg:text-base transition-colors duration-500 ${
							color != null && currentTurn === color ? "text-stone-100" : "text-slate-400"
						}`}>
						{state.user ? state.user?.username : "Player 1"}
					</div>
					<div
						className={`hidden md:flex text-[10px] font-bold tracking-wide lg:text-xs transition-colors duration-500 ${
							color != null && currentTurn === color ? "text-emerald-300" : "text-slate-500"
						}`}>
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
			<div className="flex flex-col items-center">
				<span className="mb-1 text-[10px] font-bold tracking-widest text-slate-500 sm:text-[1.5dvh]">MATCH</span>
				<div className="relative flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10 xl:h-9 xl:w-9 2xl:h-[5dvh] 2xl:w-[5dvh]">
					<div
						className="absolute inset-0 rotate-45 rounded-md border border-emerald-400/35 bg-linear-to-br from-stone-800/90 to-stone-950/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
						aria-hidden
					/>
					<span className="relative z-10 bg-linear-to-br from-emerald-200 via-emerald-400 to-teal-500 bg-clip-text text-sm font-black italic leading-none text-transparent drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)] sm:text-base">
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
				className={`flex items-center gap-1.5 rounded-xl p-1.5 transition-all duration-500 sm:gap-2 sm:p-2 justify-end ${
					color != null && currentTurn !== color
						? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
						: "opacity-65 scale-100"
				}`}>
				{/* user name & rank */}
				<div className="hidden min-w-0 overflow-hidden md:flex sm:flex-col sm:justify-center sm:items-end">
					<div
						className={`truncate text-sm font-extrabold lg:text-base transition-colors duration-500 ${
							color != null && currentTurn !== color ? "text-stone-100" : "text-slate-400"
						}`}>
						{opponentDisplayName}
					</div>
					<div
						className={`hidden md:flex text-[10px] font-bold tracking-wide lg:text-xs transition-colors duration-500 ${
							color != null && currentTurn !== color ? "text-emerald-300" : "text-slate-500"
						}`}>
						BEGINNER
					</div>
				</div>
				{/* image */}
				<img
					src={opponentAvatarUrl}
					className={`h-10 w-10 rounded-full object-fill shadow-lg ring-2 transition-all duration-500 sm:h-12 sm:w-12 xl:h-11 xl:w-11 2xl:h-20 2xl:w-20 ${
						color != null && currentTurn === color
							? "ring-emerald-300 shadow-emerald-700/20"
							: "ring-slate-700 shadow-none border border-slate-600"
					}`}></img>
			</div>
		</div>
	);
}
