import { useGame } from "../../pages/Ze/Context/GameContext";

export function GameOverModal() {
  const { gameOver, color } = useGame();

  if (!gameOver) return null;

  const isWinner = gameOver.winnerColor === color;
  const isDraw = gameOver.winnerColor === null;
  console.log(gameOver.winnerColor);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-slate-900 border border-emerald-500/30 p-10 rounded-3xl flex flex-col items-center gap-6 shadow-[0_0_60px_-15px_rgba(16,185,129,0.5)] transform transition-all scale-105">
        <h2 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">
          {isDraw ? "DRAW" : isWinner ? "VICTORY!" : "DEFEAT"}
        </h2>

        <p className="text-slate-400 text-lg">
          {isDraw
            ? "A tough battle with no clear winner."
            : isWinner
              ? "You crushed the opponent! +8 ELO"
              : "Better luck next time. -8 ELO"}
        </p>

        <span className="text-emerald-500/50 text-xs font-mono uppercase tracking-widest">
          Reason: {gameOver.reason}
        </span>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => (window.location.href = "/play")}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all"
          >
            Play Again
          </button>
          <a
            href="/settings"
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold rounded-xl transition-all"
          >
            View Stats
          </a>
        </div>
      </div>
    </div>
  );
}
