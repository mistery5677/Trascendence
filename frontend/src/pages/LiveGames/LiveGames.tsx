import { useEffect, useState } from "react";
import { useGlobalSocket } from "../../contexts/GlobalSocketContext/GlobalSocketContext";

type ActiveGame = {
	gameId: string;
	playerW: string;
	playerB: string;
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
		<div>
			<h1 style={{ color: "orange" }}>
				Live Games
			</h1>

			<p style={{ color: "cyan" }}>
				Games Found: {games.length}
			</p>

			<div style={{ color: "cyan" }}>
				{games.map((game) => (
					<div>
						{JSON.stringify(game)}
						{game.gameId}
						{game.mode}
						{game.playerW} vs {game.playerB}
					</div>
				))}
			</div>
		</div>
	);
}
