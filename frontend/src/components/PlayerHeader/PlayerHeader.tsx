import { useEffect, useState } from "react";
import { LeftUser, Timer } from "../index";
import type { PieceColor } from "../Board/Board";
import type { AuthState } from "../../contexts/UserContext/authTypes";
import type { PlayerData } from "../../api/PlayerDataType";
import { getOpponentData } from "../../api/users";
import { RightUser } from "../RightUser/RightUser";
import  magnusImg  from "../../assets/magnus-carlsen.jpg";

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
		if (!opponentId || String(opponentId).startsWith("bot")) {
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
	let opponentDisplayName;
	let opponentAvatarUrl;
	if (String(opponentId).startsWith("bot")) {
		opponentDisplayName = "Uncle Carlsen (bot)";
		opponentAvatarUrl = magnusImg;
	} else {
		opponentDisplayName = opponentProfile?.username ?? opponentId ?? "Opponent";
		opponentAvatarUrl = opponentProfile?.avatarUrl ? opponentProfile?.avatarUrl : undefined;
	}

	const isMyTurn = color != null && currentTurn === color;
	const isOpponentTurn = color != null && currentTurn !== color;

	return (
		<div
			className={`grid w-full grid-cols-[1fr_auto_1fr] items-center gap-[2%] rounded-2xl border border-emerald-300/15 bg-stone-900/70 p-[2.5%] text-white shadow-[0_14px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm ${className}`}>
			<LeftUser
				color={color}
				currentTurn={currentTurn}
				state={state}
				myTimeLeft={myTimeLeft}
				isMyTurn={isMyTurn}
				onTimeOut={onTimeOut}
			/>

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

			<RightUser
				color={color}
				currentTurn={currentTurn}
				onTimeOut={onTimeOut}
				opponentDisplayName={opponentDisplayName}
				opponentTimeLeft={opponentTimeLeft}
				isOpponentTurn={isOpponentTurn}
				opponentAvatarUrl={opponentAvatarUrl}
			/>
		</div>
	);
}
