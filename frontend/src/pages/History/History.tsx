import { History } from "lucide-react";
import { ArrowDownNarrowWideIcon, ArrowUpWideNarrowIcon } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { getMatchHistory, getHistoryByUsername } from "../../api/matches";
import { useAuth } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";
import type { Match } from "../../types";

export function HistoryPage() {
	const [history, setHistory] = useState<Match[]>([]);
	const [loading, setLoading] = useState(true);

	// The username that we want to find the match history
	const { username } = useParams<{ username: string }>();

	const { state } = useAuth(); // Get the logged user
	const myUsername = state?.user?.username;
	const targetUsername = username || "admin";

	useEffect(() => {
		document.title = "History | 42 Transcendence";

		const fetchHistory = async () => {
			if (!targetUsername) {
				setLoading(false);
				return;
			}
			setLoading(true); // Loading system
			try {
				let data;
				if (username) {
					data = await getHistoryByUsername(targetUsername);
				} else {
					data = await getMatchHistory();
				}
				setHistory(data);
			} catch (error) {
				console.error("Failed to load the history of the player: ", error);
			} finally {
				setLoading(false);
			}
		};

		fetchHistory();
	}, [username, myUsername, targetUsername]);

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
			<main className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden px-4 py-10 text-stone-100 bg-stone-900">
				<div className="pointer-events-none absolute -top-28 -left-20 h-80 w-80 rounded-full bg-stone-400/20 blur-3xl" />
				<div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-amber-200/10 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-stone-600/20 blur-3xl" />

				<div className="relative mx-auto w-full lg:w-[60%] rounded-3xl border border-stone-200/20 bg-stone-200/10 p-8 shadow-[0_30px_80px_rgba(28,25,23,0.7)] backdrop-blur-2xl">
					{/* Header */}
					<header className="mb-8">
						<h1 className="text-4xl font-extrabold tracking-tight flex gap-2 items-center text-emerald-200">
							<History className="text-emerald-300" />
							HISTORY
						</h1>
					</header>
					{/* GRID */}
					<section className="w-full mt-6">
						<div className="w-full overflow-scroll rounded-2xl border border-stone-800 bg-stone-900/50 shadow-lg">
							<table className="w-full text-center border-collapse">
								{/* DATA HEADER */}
								{/* Thead defines a set of rows */}
								<thead className="text-xl bg-stone-700/20">
									<tr>
										<th
											onClick={() => handleIcon(1)}
											className="p-4 hover:bg-stone-700/20 cursor-pointer transition">
											<div className="flex items-center justify-center gap-2">
												Opponent {firstArrow ? arrowIcon["asc"] : arrowIcon["desc"]}
											</div>
										</th>
										<th
											onClick={() => handleIcon(2)}
											className="p-4 hover:bg-stone-700/40 cursor-pointer transition">
											<div className="flex items-center justify-center gap-2">
												Date {secondArrow ? arrowIcon["asc"] : arrowIcon["desc"]}
											</div>
										</th>
										<th className="p-4 hover:bg-stone-700/40">Played As</th>
										<th className="p-4 hover:bg-stone-700/40">Result</th>
									</tr>
								</thead>

								{/* MATCH TABLE */}
								<tbody>
									{loading ? (
										<tr>
											<td
												colSpan={4}
												className="p-8 text-center text-stone-400">
												Loading matches...
											</td>
										</tr>
									) : history.length === 0 ? (
										<tr>
											<td
												colSpan={4}
												className="p-8 text-center text-stone-400">
												No matches found in your history.
											</td>
										</tr>
									) : (
										history.map((match) => {
											let hoverResultColor = "text-slate-400";
											let resultColor = "text-[#D6A756]";
											if (match.result === "WIN") {
												resultColor = "text-[#7FB077]";
												hoverResultColor = "text-emerald-400";
											} else if (match.result === "LOSS") {
												resultColor = "text-[#E1707A]";
												hoverResultColor = "text-red-100";
											}

											const dateStr = new Date(match.createdAt).toLocaleDateString();

											return (
												<tr
													key={match.gameId}
													className="border-t border-stone-800 hover:bg-stone-800/40 transition-colors">
													<td className="p-4 font-bold text-stone-200">{match.opponent}</td>
													<td className="p-4 text-stone-400">{dateStr}</td>
													<td className="p-4 text-stone-400">{match.playedAs}</td>
													<td
														className={`p-4 font-black tracking-wider hover:${hoverResultColor} ${resultColor}`}>
														{match.result}
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
