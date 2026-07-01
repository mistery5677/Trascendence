import { useEffect, useState } from "react";
import { useGlobalSocket } from "../../contexts/GlobalSocketContext/GlobalSocketContext";
import { LiveGameCard } from "../../components/LiveGameCard/LiveGameCard";

export type ActiveGame = {
    gameId: string;

    playerWId: string;
    playerBId: string;

    playerWName: string;
    playerBName: string;

	playerWAvatar?: string;
	playerBAvatar?: string;

    mode: "online" | "bot" | "ai";
};

export function LiveGames() {
	const { socket } = useGlobalSocket();
	const [games, setGames] = useState<ActiveGame[]>([]);

	useEffect(() => {
		if (!socket)
			return;

		socket.emit("listActiveGames");
	}, [socket]);

	useEffect(() => {
		if (!socket)
			return;

		const handleActiveGames = (activeGames: any) => {
			setGames(activeGames);
		};

		socket.on("activeGames", handleActiveGames);

		return () => {
			socket.off("activeGames", handleActiveGames);
		};
	}, [socket]);

	return (
		<div className="relative min-h-screen overflow-hidden bg-stone-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-stone-100">
			<div className="pointer-events-none absolute -top-28 -left-20 h-80 w-80 rounded-full bg-stone-400/20 blur-3xl" />
			<div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-amber-200/10 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-stone-600/20 blur-3xl" />
				<div className="text-center mb-12 animate-fade-in">
					<h1 className="text-4xl sm:text-5xl font-black text-stone-100 tracking-tight">
						Live{" "}
						<span className="text-transparent bg-clip-text bg-linear-to-r from-lime-300 to-emerald-300">
							Games
						</span>
					</h1>

					
					<div className="my-4">
						<p className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
							Games Found:
						</p>
						<p className="text-2xl sm:text-3xl font-black text-stone-100 tracking-tight">
							{games.length}
						</p>
					</div>

					<div>
						{games.map((game) => (
							<div>
								<LiveGameCard p_game={game} />
							</div>
						))}
				</div>
			</div>
		</div>
	);
}
