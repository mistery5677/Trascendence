import type { ActiveGame } from "../../pages/LiveGames/LiveGames";

type LiveGameCardProps = {
	p_game: ActiveGame;
};

export function LiveGameCard({ p_game }: LiveGameCardProps) {
	return (
		<div className="bg-stone-700/50 rounded-3xl border border-stone-700 shadow-2xl backdrop-blur-md overflow-hidden">
			<p>
				<strong> {p_game.playerWName} </strong> vs <strong> {p_game.playerBName} </strong>
			</p>
			<p>
				<strong> Mode: </strong> {p_game.mode}
			</p>
		</div>
	)
}