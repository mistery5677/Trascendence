import { History } from "lucide-react";
import { ArrowDownNarrowWideIcon, ArrowUpWideNarrowIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function HistoryPage() {
	useEffect(() => {
		document.title = "History | 42 Transcendence";
	}, []);

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
			<main className="min-h-[calc(100vh-5rem)] w-full px-4 py-10 text-stone-100 bg-stone-800 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
				<div className="mx-auto w-full lg:w-[60%] bg-stone-900/90 border border-stone-700 rounded-3xl p-8 shadow-lg shadow-slate-950/30">
					{/* Header */}
					<header className="mb-8">
						<h1 className="text-4xl font-extrabold tracking-tight flex gap-2 items-center text-emerald-200">
							<History className="text-emerald-300" />
							HISTORY
						</h1>
					</header>
					{/* GRID */}
					<section className="overflow-x-auto">
						<div className="min-w-[800px]">
							<table className="w-full table-auto rounded-3xl overflow-hidden border border-stone-700 bg-stone-950/80 text-left text-stone-100">
								<thead className="bg-stone-900/80 text-stone-100">
									<tr>
										<th
											onClick={() => handleIcon(1)}
											className="w-40 px-4 py-4 text-sm font-semibold uppercase tracking-wide text-stone-200 hover:bg-stone-800/70 cursor-pointer transition">
											Task {firstArrow ? arrowIcon["asc"] : arrowIcon["desc"]}
										</th>
										<th
											onClick={() => handleIcon(2)}
											className="w-40 px-4 py-4 text-sm font-semibold uppercase tracking-wide text-stone-200 hover:bg-stone-800/70 cursor-pointer transition">
											Time {secondArrow ? arrowIcon["asc"] : arrowIcon["desc"]}
										</th>
										<th className="w-40 px-4 py-4 text-sm font-semibold uppercase tracking-wide text-stone-200 hover:bg-stone-800/70 cursor-pointer transition">
											Data {arrowIcon["asc"]}
										</th>
										<th className="w-40 px-4 py-4 text-sm font-semibold uppercase tracking-wide text-stone-200 hover:bg-stone-800/70 cursor-pointer transition">
											Status
										</th>
										<th className="w-40 px-4 py-4 rounded-tr-3xl text-sm font-semibold uppercase tracking-wide text-stone-200 hover:bg-stone-800/70 cursor-pointer transition">
											Type
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-stone-700">
									<tr className="bg-stone-900/70">
										<td className="px-4 py-4">{}</td>
										<td className="px-4 py-4">{}</td>
										<td className="px-4 py-4">{}</td>
										<td className="px-4 py-4">{}</td>
										<td className="px-4 py-4">{}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>
				</div>
			</main>
		</>
	);
}
