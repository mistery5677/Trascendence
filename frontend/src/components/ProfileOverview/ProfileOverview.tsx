import type { ProfileStatsVM } from "../../models/profileStats";

type Match = {
	id: string;
	opponent: string;
	result: "win" | "loss" | "draw";
	eloChange: number;
	date: string;
};

// type Stats = {
// 	games: number; // total number of games played
// 	wins: number;
// 	losses: number;
// 	draws: number;
// 	winRate: number;
// 	bestElo?: number;
// 	currentStreak?: number;
// };

type Props = {
	stats: ProfileStatsVM;
	recentMatches?: Match[];
};

export function ProfileOverview({ stats, recentMatches = [] }: Props) {
	const formStrip = recentMatches.slice(0, 8);

	return (
		<div className="space-y-6 text-zinc-100 antialiased">
			{/* RATING LEDGER HEADER */}
			<div className="border-2 border-white/10 bg-stone-900/40 backdrop-blur-md rounded-2xl overflow-hidden">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-6 py-6 border-b border-white/10">
					{/* Peak Rating Principal */}
					<div className="space-y-0.5">
						<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Peak Rating</p>
						<div className="flex items-baseline gap-1.5">
							<p className="font-mono text-5xl font-black tracking-tight tabular-nums text-[#F5B041]">
								{stats.bestElo ?? "—"}
							</p>
							<span className="text-[10px] font-bold text-stone-500 font-mono tracking-wider">ELO</span>
						</div>
					</div>
					<div className="space-y-0.5">
						<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
							Current Rating
						</p>
						<div className="flex items-baseline gap-1.5">
							<p className="font-mono text-5xl font-black tracking-tight tabular-nums text-[#2ECC71]">
								{stats.currentElo ?? "—"}
							</p>
							<span className="text-[10px] font-bold text-stone-500 font-mono tracking-wider">ELO</span>
						</div>
					</div>

					{/* Form Strip com Alinhamento Melhorado */}
					<div className="flex flex-col items-start sm:items-end gap-2">
						<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
							Recent Form
							{stats.currentStreak ? (
								<span className="ml-2 font-mono text-stone-300 bg-white/5 px-1.5 py-0.5 rounded text-[9px] tracking-normal border border-white/5">
									{stats.currentStreak} STRK
								</span>
							) : null}
						</p>
						<div className="flex items-center gap-1.5 bg-black/20 px-2 py-1.5 rounded border border-white/5">
							{formStrip.length === 0 && (
								<span className="text-xs text-stone-500 font-mono px-1">no data</span>
							)}
							{[...formStrip].reverse().map((m) => (
								<span
									key={m.id}
									title={`${m.result.toUpperCase()} vs ${m.opponent}`}
									className={`h-3 w-3 rounded-xs transition-transform hover:scale-110 cursor-help ${
										m.result === "win"
											? "bg-[#7FB077]"
											: m.result === "loss"
												? "bg-[#E1707A]/80"
												: "bg-[#D6A756]/80"
									}`}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Linha de Estatísticas Compacta */}
				<div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-white/10">
					<LedgerStat
						label="Games"
						value={stats.totalGames ?? "—"}
					/>
					<LedgerStat
						label="Wins"
						value={stats.wins ?? "—"}
						accent="text-[#7FB077]"
					/>
					<LedgerStat
						label="Losses"
						value={stats.losses ?? "—"}
						accent="text-[#E1707A]"
					/>
					<LedgerStat
						label="Draws"
						value={stats.draws ?? "—"}
						accent="text-[#D6A756]"
					/>
					<LedgerStat
						label="Win Rate"
						value={stats.winRate !== undefined ? `${stats.winRate}%` : "—"}
					/>
				</div>
			</div>

			{/* RECENT MATCHES LEDGER */}
			<div className="border-2 border-white/10 bg-stone-900/40 backdrop-blur-md rounded-2xl overflow-hidden">
				<div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<h2 className="text-sm font-bold tracking-wider text-zinc-200 uppercase">Recent Matches</h2>
						<span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white/5 rounded text-stone-400 border border-white/5">
							LOG
						</span>
					</div>
					<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
						Last {Math.min(recentMatches.length, 3)} Match
						{Math.min(recentMatches.length, 3) === 1 ? "" : "es"}
					</span>
				</div>

				{recentMatches.length === 0 ? (
					<p className="px-6 py-8 text-sm text-stone-400 font-medium">No matches recorded yet.</p>
				) : (
					<div className="divide-y divide-white/[0.06]">
						{recentMatches.slice(0, 3).map((match, i) => {
							const matchResult = match.result as "win" | "loss" | "draw";
							return (
								<div
									key={match.id}
									className="group flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors relative">
									{/* Indicador de linha interativo discreto na borda interna */}
									<div
										className={`absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${matchResult === "win" ? "bg-[#7FB077]" : matchResult === "loss" ? "bg-[#E1707A]" : "bg-[#D6A756]"}`}
									/>

									<span className="font-mono text-xs text-stone-500 font-semibold w-6 shrink-0 group-hover:text-stone-400 transition-colors">
										{String(recentMatches.length - i).padStart(2, "0")}
									</span>

									<span
										className={`font-mono text-[10px] font-black px-2 py-0.5 rounded-[3px] tracking-wider shrink-0 border ${
											matchResult === "win"
												? "text-[#7FB077] bg-[#7FB077]/10 border-[#7FB077]/20"
												: matchResult === "loss"
													? "text-[#E1707A] bg-[#E1707A]/10 border-[#E1707A]/20"
													: "text-[#D6A756] bg-[#D6A756]/10 border-[#D6A756]/20"
										}`}>
										{matchResult === "win" ? "WIN" : matchResult === "loss" ? "LOSS" : "DRAW"}
									</span>

									<div className="flex-1 min-w-0 pl-1">
										<p className="text-sm font-semibold text-white tracking-wide truncate">
											vs {match.opponent}
										</p>
										<p className="text-xs text-stone-400 font-medium mt-0.5">{match.date}</p>
									</div>

									<div className="text-right shrink-0">
										<span
											className={`font-mono text-base font-bold tabular-nums tracking-tight ${
												match.eloChange > 0
													? "text-[#7FB077]"
													: match.eloChange < 0
														? "text-[#E1707A]"
														: "text-[#D6A756]"
											}`}>
											{match.eloChange > 0 ? "+" : ""}
											{match.eloChange}
										</span>
										<p className="text-[9px] font-mono text-stone-500 font-bold uppercase tracking-wider mt-0.5">
											PTS
										</p>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

function LedgerStat({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
	return (
		<div className="px-5 py-4 hover:bg-white/[0.01] transition-colors group">
			<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 group-hover:text-stone-300 transition-colors">
				{label}
			</p>
			<p className={`font-mono text-xl font-bold tracking-tight tabular-nums mt-1.5 ${accent ?? "text-white"}`}>
				{value}
			</p>
		</div>
	);
}
