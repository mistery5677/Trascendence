import { useGame } from "../../contexts/GameContext/GameContext";

export const GameActions = () => {
  const { surrender, proposeDraw, isConnected, gameOver, gameId } = useGame();

  if (!gameId) return;

  const handleSurrender = () => {
    const confirm = window.confirm(
      "Are you sure that you want to surrender? It will be your defeat",
    );
    if (confirm) {
      surrender();
    }
  };

  const handleProposeDraw = () => {
    const confirm = window.confirm(
      "Are you sure that you want to propose Draw?",
    );
    if (confirm) {
      proposeDraw();
    }
  };

  return (
    <div className="flex flex-col text-white">
      <h3 className="text-white font-bold text-lg border-b">Actions</h3>
      <button onClick={handleSurrender}>🏳️ Surrender</button>
      <button onClick={handleProposeDraw}>🤝 Offer Draw</button>
    </div>
  );
};
