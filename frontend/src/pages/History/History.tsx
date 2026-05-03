import { History } from "lucide-react";
import { ArrowDownNarrowWideIcon, ArrowUpWideNarrowIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getMatchHistory } from "../../api/matches";
import { useAuth } from "../../contexts/UserContext";

export function HistoryPage() {
	const { state } = useAuth(); // Get the logged user
    const myUserId = state?.user?.id;

	const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


	useEffect(() => {
		document.title = "History | 42 Transcendence";

		const fetchHistory = async () => {
			setLoading(true); // Loading system
			const data = await getMatchHistory();
			setHistory(data);
			setLoading(false)
		}

		// Check if the myUserId is already loaded
		if (myUserId){
			fetchHistory();
		}
	}, [myUserId]);

	const [firstArrow, setFirstArrow] = useState<boolean>(true);
	const [secondArrow, setSecondArrow] = useState<boolean>(true);

	const arrowIcon: Record<"asc" | "desc", JSX.Element> = {
		asc: <ArrowDownNarrowWideIcon />,
		desc: <ArrowUpWideNarrowIcon />,
	};

	const handleIcon = (num: number) => {
		switch (num) {
			case 1: {
				return setFirstArrow(!firstArrow);
			}
			case 2: {
				return setSecondArrow(!secondArrow);
			}
			case 3: {
				return setSecondArrow(!secondArrow);
			}

			default:
				return null;
		}
	};

	return (
		<>
			<main className="min-h-[calc(100vh-5rem)] w-full px-4 py-10 text-stone-100">
				<div className="mx-auto w-full lg:w-[60%]">
					{/* Header */}
					<header className="mb-8">
						<h1 className="text-4xl font-extrabold tracking-tight flex gap-2 items-center bg-linear-to-r from-emerald-200 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
							<History className="text-white" />
							HISTORY
						</h1>
					</header>
					{/* GRID */}
					<section className="w-full mt-6">
						<div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-lg">
							
							<table className="w-full text-center border-collapse">
								
								{/* DATA HEADER */}
								{ /* Thead defines a set of rows */ }
								<thead className="text-xl bg-blue-400/20">
									<tr>
										<th onClick={() => handleIcon(1)} className="p-4 hover:bg-stone-700/40 cursor-pointer transition">
											<div className="flex items-center justify-center gap-2">
												Opponent {firstArrow ? arrowIcon["asc"] : arrowIcon["desc"]}
											</div>
										</th>
										<th onClick={() => handleIcon(2)} className="p-4 hover:bg-stone-700/40 cursor-pointer transition">
											<div className="flex items-center justify-center gap-2">
												Date {secondArrow ? arrowIcon["asc"] : arrowIcon["desc"]}
											</div>
										</th>
										<th className="p-4 hover:bg-stone-700/40">
											Played As
										</th>
										<th className="p-4 hover:bg-stone-700/40">
											Result
										</th>
									</tr>
								</thead>

								{/* MATCH TABLE */}
								<tbody>
									{loading ? (
										<tr>
											<td colSpan={4} className="p-8 text-center text-slate-400">Loading matches...</td>
										</tr>
									) : history.length === 0 ? (
										<tr>
											<td colSpan={4} className="p-8 text-center text-slate-400">No matches found in your history.</td>
										</tr>
									) : (
										history.map((match) => {
											const amIPlayerA = match.playerAId === myUserId;
											const opponentName = amIPlayerA ? match.playerB.username : match.playerA.username;
											const playedAs = amIPlayerA ? "White" : "Black";
											
											let resultText = "DRAW";
											let resultColor = "text-slate-400";
											
											if (match.result === 'PLAYER_A_WINS') {
												resultText = amIPlayerA ? "VICTORY" : "DEFEAT";
												resultColor = amIPlayerA ? "text-emerald-400" : "text-red-400";
											} else if (match.result === 'PLAYER_B_WINS') {
												resultText = !amIPlayerA ? "VICTORY" : "DEFEAT";
												resultColor = !amIPlayerA ? "text-emerald-400" : "text-red-400";
											}

											const dateStr = new Date(match.createdAt).toLocaleDateString();

											return (
												<tr key={match.id} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
													<td className="p-4 font-bold text-stone-200">
														{opponentName}
													</td>
													<td className="p-4 text-slate-400">
														{dateStr}
													</td>
													<td className="p-4 text-slate-400">
														{playedAs}
													</td>
													<td className={`p-4 font-black tracking-wider ${resultColor}`}>
														{resultText}
													</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
