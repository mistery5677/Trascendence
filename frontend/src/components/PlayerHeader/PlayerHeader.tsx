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

type RankLabelProps = {
	rank: string;
	isActive: boolean;
	align?: "left" | "right";
};

function RankLabel({ rank, isActive, align = "left" }: RankLabelProps) {
	const isLong = rank.length > 5;

	return (
		<div className="relative hidden md:flex group">
			<div
				className={`text-[10px] font-bold tracking-wide lg:text-xs transition-colors duration-500 ${
					isActive ? "text-emerald-300" : "text-slate-500"
				} ${isLong ? "max-w-[5ch] truncate" : ""}`}>
				{rank}
			</div>
			{isLong && (
				<div
					className={`pointer-events-none absolute top-full z-20 mt-1 rounded-md border border-emerald-300/35 bg-stone-900/95 px-2 py-1 text-[10px] font-semibold tracking-wide text-emerald-200 opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 ${
						align === "right" ? "right-0 -translate-y-1" : "left-0 -translate-y-1"
					}`}>
					{rank}
				</div>
			)}
		</div>
	);
}

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
			className={`flex w-full items-center justify-between gap-2 rounded-2xl border border-emerald-300/15 bg-stone-900/70 p-2 2xl:p-[3%] text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-3 xl:p-2 ${className}`}>
			{/* left user */}
			<div
				className={`flex w-[42%] max-w-[42%] min-w-0 items-center gap-2 rounded-2xl p-3 transition-all duration-500 sm:gap-3 md:gap-4 xl:gap-10 2xl:gap-8 sm:p-3 sm:pr-4 xl:pr-5 2xl:pr-10 ${
					color != null && currentTurn === color
						? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
						: "opacity-65 scale-100"
				}`}>
				{/* image */}
				<div className="flex items-center gap-1.5 rounded-xl p-1.5 transition-all duration-500 sm:gap-2 sm:p-2">
					<img
						src={state.user?.avatarUrl}
						className={`h-10 w-10 rounded-full object-fill shadow-lg ring-2 transition-all duration-500 sm:h-12 sm:w-12 xl:h-11 xl:w-12 2xl:h-20 2xl:w-20 ${
							color != null && currentTurn === color
								? "ring-emerald-300 shadow-emerald-700/20"
								: "ring-slate-700 shadow-none border border-slate-600"
						}`}></img>
					{/* user name & rank */}
					<div className="hidden min-w-0 md:flex flex-col justify-center items-start overflow-visible">
						<div
							className={`hidden truncate md:flex text-sm font-extrabold lg:text-base transition-colors duration-500 ${
								color != null && currentTurn === color ? "text-stone-100" : "text-slate-400"
							}`}>
							{state.user ? state.user?.username : "Player 1"}
						</div>
						<RankLabel
							rank="GRANDMASTER"
							isActive={color != null && currentTurn === color}
							align="left"
						/>
					</div>
				</div>
				<div className="shrink-0">
					<Timer
						timeLeftInSeconds={myTimeLeft}
						isRunning={isMyTurn}
						onTimeUp={() => {
							if (color) onTimeOut(color); // Avisa que TU perdeste por tempo
						}}
					/>
				</div>
			</div>

			{/* VS — diamond plate + gradient type */}
			<div className="flex flex-col items-center">
				<span className="mb-1 text-[10px] font-bold tracking-widest text-slate-500 sm:text-[1.5dvh]">
					MATCH
				</span>
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

			{/* right user */}
			<div
				className={`flex w-[42%] max-w-[42%] min-w-0 items-center gap-2 rounded-2xl p-3 transition-all duration-500 sm:gap-3 md:gap-4 xl:gap-10 2xl:gap-8 justify-end sm:p-3 sm:pl-4 xl:pl-5 2xl:pl-10 ${
					color != null && currentTurn !== color
						? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
						: "opacity-65 scale-100"
				}`}>
				<div className="shrink-0">
					<Timer
						timeLeftInSeconds={opponentTimeLeft}
						isRunning={isOpponentTurn}
						onTimeUp={() => {
							// Avisa que o adversário perdeu por tempo
							const opponentColor = color === "w" ? "b" : "w";
							onTimeOut(opponentColor);
						}}
					/>
				</div>

				<div className="flex items-center gap-1.5 rounded-xl p-1.5 transition-all duration-500 sm:gap-2 sm:p-2">
					{/* user name & rank */}
					<div className="hidden min-w-0 md:flex sm:flex-col sm:justify-center sm:items-end overflow-visible">
						<div
							className={`truncate text-sm font-extrabold lg:text-base transition-colors duration-500 ${
								color != null && currentTurn !== color ? "text-stone-100" : "text-slate-400"
							}`}>
							{opponentDisplayName}
						</div>
						<RankLabel
							rank="BEGINNER"
							isActive={color != null && currentTurn !== color}
							align="right"
						/>
					</div>
					{/* image */}
					<img
						src={opponentAvatarUrl}
						className={`h-10 w-10 rounded-full object-fill shadow-lg ring-2 transition-all duration-500 sm:h-12 sm:w-12 xl:h-11 xl:w-12 2xl:h-20 2xl:w-20 ${
							color != null && currentTurn === color
								? "ring-emerald-300 shadow-emerald-700/20"
								: "ring-slate-700 shadow-none border border-slate-600"
						}`}></img>
				</div>
			</div>
		</div>
	);
}
