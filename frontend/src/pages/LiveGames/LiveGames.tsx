import { useEffect, useState } from "react";
import { useGlobalSocket } from "../../contexts/GlobalSocketContext/GlobalSocketContext";

export function LiveGames() {
	const { socket } = useGlobalSocket();
	const [games, setGames] = useState([]);

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
		</div>
	);
}