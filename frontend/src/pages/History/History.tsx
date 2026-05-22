import { History } from "lucide-react";
import { ArrowDownNarrowWideIcon, ArrowUpWideNarrowIcon } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { getMatchHistory, getHistoryByUsername } from "../../api/matches";
import { useAuth } from "../../contexts/UserContext";
import { useParams } from "react-router-dom";

export function HistoryPage() {
	const [history, setHistory] = useState<any[]>([]);
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
											const isTargetPlayerA = match.playerA.username === targetUsername;
											const opponentName = isTargetPlayerA
												? match.playerB.username
												: match.playerA.username;
											const playedAs = isTargetPlayerA ? "White" : "Black";

											const targetUserId = isTargetPlayerA ? match.playerAId : match.playerBId; // We need to check who won

											let resultText = "DRAW"; // The match result to return
											let resultColor = "text-slate-400";

											if (match.result.startsWith("WINNER_ID_")) {
												const winnerId = parseInt(match.result.replace("WINNER_ID_", ""));

												// If the winner ID is equal to the target, its victory as result
												if (winnerId === targetUserId) {
													resultText = "VICTORY";
													resultColor = "text-emerald-400";
												} else {
													resultText = "DEFEAT";
													resultColor = "text-red-400";
												}
											}

											const dateStr = new Date(match.createdAt).toLocaleDateString();

											return (
												<tr
													key={match.id}
													className="border-t border-stone-800 hover:bg-stone-800/40 transition-colors">
													<td className="p-4 font-bold text-stone-200">{opponentName}</td>
													<td className="p-4 text-stone-400">{dateStr}</td>
													<td className="p-4 text-stone-400">{playedAs}</td>
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
