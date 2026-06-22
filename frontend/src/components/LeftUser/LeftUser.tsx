import { useState } from "react";
import type { User } from "../../contexts/UserContext/authTypes";
import { displayElo } from "../../utils/displayElo";
import { Timer } from "../Timer/Timer";
import frame from "../../assets/title.png";
import { TitleFrame } from "../TitleFrame/TitleFrame";

type LeftUserProps = {
	color: "w" | "b" | null;
	currentTurn: "w" | "b";
	state: { user: User | null; isLoading: boolean };
	myTimeLeft: number;
	isMyTurn: boolean;
	onTimeOut: (loserColor: "w" | "b") => void;
};

export function LeftUser({ color, currentTurn, state, myTimeLeft, isMyTurn, onTimeOut }: LeftUserProps) {
	const [showNumber, setShowNumber] = useState(false);

	return (
		<>
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
					className={`aspect-square w-[34%] md:w-[20%] shrink-0 rounded-full object-fit shadow-lg ring-2 transition-all duration-500 ${
						color != null && currentTurn === color
							? "ring-emerald-300 shadow-emerald-700/20"
							: "ring-slate-700 shadow-none border border-slate-600"
					}`}
				/>
				{/* name & rank + timer */}
				<div className="max-w-[80%] md:flex items-center flex-nowrap gap-[4%] flex-1 min-w-0">
					<div className="flex flex-col justify-center items-start flex-1 min-w-0 w-full">
						{/* GROUP 1: Username Tooltip Group */}
						<div className="group relative w-full overflow-visible text-left left-2 sm:left-2">
							{/* Username Display Text */}
							<div
								className={`truncate w-full max-w-[11ch] sm:max-w-[14ch] md:max-w-full text-[clamp(0.72rem,1vw,2.5rem)] font-extrabold transition-colors duration-500 ${
									color != null && currentTurn === color ? "text-stone-100" : "text-slate-400"
								}`}>
								{state.user ? state.user?.username : "Player 1"}
							</div>

							{/* Tooltip for Username */}
							<div className="z-50 absolute bottom-full left-0 mb-2 rounded-md border border-emerald-300/35 bg-stone-900/95 px-2 py-1 text-[15px] font-semibold tracking-wide text-emerald-200 opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:-translate-y-0.5 whitespace-nowrap pointer-events-none">
								{state.user ? state.user?.username : "Player 1"}
							</div>
						</div>

						{/* GROUP 2: ELO Tooltip Group */}
						<div className="group relative w-full overflow-visible text-left left-2 sm:-left-2">
							{/* <img
								src={frame}
								alt="Chess frame"
								className="absolute inset-0 w-full h-full object-contain"
							/> */}
							{/* ELO Display Text */}
							<div
								className={`w-full max-w-[11ch] sm:max-w-[14ch] md:max-w-full text-[clamp(0.58rem,0.72vw,1rem)] font-semibold tracking-wide transition-colors duration-500 ${
									color != null && currentTurn === color ? "text-emerald-300" : "text-slate-500"
								}`}>
								{/* <TitleFrame frame={frame}>{displayElo(state.user?.score?.elo as number | null)}</TitleFrame> */}
								<TitleFrame frame={frame}>GRANDMASTER</TitleFrame>
								{/* GRANDMASTER */}
								{/* {displayElo(state.user?.score?.elo as number | null)} */}
							</div>

							{/* Tooltip for ELO Number */}
							<div className="z-50 absolute bottom-full left-0 mb-2 rounded-md border border-emerald-300/35 bg-stone-900/95 px-2 py-1 text-[15px] font-semibold tracking-wide text-emerald-200 opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100 group-hover:-translate-y-0.5 whitespace-nowrap pointer-events-none">
								{state.user?.score?.elo ? state.user?.score.elo : "N/A"}
							</div>
						</div>
					</div>

					{/* Timer Section */}
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
		</>
	);
}
