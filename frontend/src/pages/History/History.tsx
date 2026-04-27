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
					<section className="flex mw-max">
						<table className="grid grid-rows-5">
							<thead className="text-xl font-stretch-20% bg-blue-400/20 rounded-t-2xl">
								<tr className="flex">
									<th
										onClick={() => handleIcon(1)}
										className="flex w-40 hover:bg-stone-700/40 rounded-tl-2xl transition items-center gap-2 justify-center p-4 hover:cursor-pointer">
										Task {firstArrow ? arrowIcon["asc"] : arrowIcon["desc"]}
									</th>
									<th
										onClick={() => handleIcon(2)}
										className="flex w-40 items-center gap-2 hover:bg-stone-700/40 justify-center hover:cursor-pointer">
										Time {secondArrow ? arrowIcon["asc"] : arrowIcon["desc"]}
									</th>
									<th className="flex w-40 gap-2 justify-center items-center hover:bg-stone-700/40 hover:cursor-pointer">
										Data {arrowIcon["asc"]}
									</th>
									<th className="flex w-40 gap-2 justify-center items-center hover:bg-stone-700/40">
										Status
									</th>
									<th className="flex w-40 gap-2 justify-center items-center rounded-tr-2xl hover:bg-stone-700/40">
										Type
									</th>
								</tr>
							</thead>

							<tbody>
								<tr>
									<td>{}</td>
									<td>{}</td>
									<td>{}</td>
									<td>{}</td>
									<td>{}</td>
								</tr>
							</tbody>
						</table>
					</section>
				</div>
			</main>
		</>
	);
}
