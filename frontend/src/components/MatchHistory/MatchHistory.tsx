type Match = {
	id: string;
	opponent: string;
	result: "win" | "loss" | "draw";
	eloChange: number;
	date: string;
	mode?: string;
	score?: string;
};

type Props = {
	matches: Match[];
};

export function MatchHistory({ matches }: Props) {
	return (
		<div className="bg-stone-900/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
			{/* HEADER */}
			<div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-bold tracking-wider text-zinc-200 uppercase">Match History</h2>
					<span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white/5 rounded text-stone-400 border border-white/5">
						ALL
					</span>
				</div>
				<span className="text-[10px] font-mono font-bold text-stone-500">TOTAL: {matches.length}</span>
			</div>

			{/* LIST CONTAINER */}
			<div className="max-h-[500px] overflow-y-auto divide-y divide-white/[0.06] custom-scrollbar">
				{matches.length === 0 ? (
					<p className="px-6 py-8 text-sm text-stone-400 font-medium">No matches found.</p>
				) : (
					matches.map((match, i) => {
						const matchResult = match.result as "win" | "loss" | "draw";
						return (
							<div
								key={match.id}
								className="group flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors relative">
								{/* Indicador de linha interativo na borda lateral esquerda */}
								<div
									className={`absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity ${
										matchResult === "win" ? "bg-[#7FB077]" : matchResult === "loss" ? "bg-[#E1707A]" : "bg-[#D6A756]"
									}`}
								/>

								{/* Contador de índice indexado decrescente */}
								<span className="font-mono text-xs text-stone-500 font-semibold w-6 shrink-0 group-hover:text-stone-400 transition-colors">
									{String(matches.length - i).padStart(2, "0")}
								</span>

								{/* Emblema Badge do resultado com as suas cores personalizadas */}
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

								{/* Detalhes do oponente, modo e pontuação */}
								<div className="flex-1 min-w-0 pl-1">
									<p className="text-sm font-semibold text-white tracking-wide truncate">
										vs {match.opponent}
									</p>
									<p className="text-xs text-stone-400 font-medium mt-0.5">
										{match.date}
										{match.mode ? ` • ${match.mode}` : ""}
										{match.score ? ` • ${match.score}` : ""}
									</p>
								</div>

								{/* Mudança de ELO com as suas cores originais de texto */}
								<div className="text-right shrink-0">
									<span
										className={`font-mono text-base font-bold tabular-nums tracking-tight ${
											match.eloChange > 0 ? "text-[#7FB077]" : match.eloChange < 0 ? "text-[#E1707A]" : "text-[#D6A756]"
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
					})
				)}
			</div>
		</div>
	);
}
