import { useGame } from "../../contexts/GameContext/GameContext";
import { SurrenderButton } from "../SurrenderButton/SurrenderButton";
import { OfferDrawButton } from "../OfferDrawButton/OfferDrawButton";

export const GameActions = () => {
	const { surrender, proposeDraw, isConnected, gameOver, gameId } = useGame();

	if (!gameId) return null;

	const disabled = !isConnected || Boolean(gameOver);

	return (
		<div className="mt-3 grid grid-cols-1 sm:grid-cols-2">
			<SurrenderButton func={surrender} />
			<OfferDrawButton func={proposeDraw} />
		</div>
	);
};
