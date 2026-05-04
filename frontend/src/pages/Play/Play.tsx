import { useEffect, useState } from "react";
import { Board, Timer } from "../../components";
import type { PieceColor } from "../../components/Board/Board";
import { useAuth } from "../../contexts/UserContext";
import { useSearchParams } from "react-router-dom";
import { GameProvider, useGame } from "../../contexts/GameContext/GameContext";
import { MatchmakingLoading } from "../../components/MatchMaking/MatchMakingLoading";
import { GameOverModal } from "../../components/GameOver/GameOverModal";
import { Chat } from "../../components/Chat/Chat";
import { GameActions } from "../../components/Board/GameActions";

export function PlayWrapper() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "online";
  const gameId = searchParams.get("gameId");
  const { state: authState } = useAuth();

  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }
  //! Here for the moment because middleware, checks if the user is logged in
  //! For bot propose is still to validate
  if (!authState.user) {
    return <div className="text-white">Have to been logged to play</div>;
  }

  return (
    <GameProvider mode={mode} gameId={gameId}>
      <Play />
    </GameProvider>
  );
}

function Play() {
  const { state } = useAuth();
  const [currentTurn, setCurrentTurn] = useState<PieceColor>("w");
  const [timerKey, setTimerKey] = useState(0); // Key to force timer reset
  const { gameId, isConnected, color } = useGame();
  // We create a 'state' to store te game result

  useEffect(() => {
    setTimerKey((prevKey) => prevKey + 1);
  }, [currentTurn]);

  const handleTurnChange = (newTurn: PieceColor) => {
    setCurrentTurn(newTurn);
  };

  if (!gameId) {
    return <MatchmakingLoading isConnected={isConnected} />;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-stone-800 to-slate-900 font-sans flex flex-col items-center py-12 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')]">
      {/* Ambient Glowing Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-[20%] -left-[10%] w-[36vw] h-[36vw] bg-emerald-700/20 rounded-full blur-[110px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-emerald-500/12 rounded-full blur-[95px]"></div>
      </div>
      {/* GameOver */}
      <GameOverModal />
      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 xl:grid-cols-[1fr_minmax(0,52rem)_26rem] gap-8 items-start px-4">
        <div className="w-full xl:col-start-2 flex flex-col items-center justify-center gap-8">
          {/* Player vs Player Header Area */}
          <div className="flex flex-row text-white w-full justify-between items-center bg-stone-900/70 p-4 sm:p-6 rounded-2xl border border-emerald-300/15 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-sm">
            {/* left user */}
            <div
              className={`flex flex-row items-center gap-3 sm:gap-4 p-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-500 ${
                currentTurn === color
                  ? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
                  : "opacity-65 scale-100"
              }`}
            >
              {/* image */}
              <img
                src={state.user?.avatarUrl}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full ring-4 object-fill shadow-lg transition-all duration-500 ${
                  currentTurn === color
                    ? "ring-emerald-300 shadow-emerald-700/20"
                    : "ring-slate-700 shadow-none border border-slate-600"
                }`}
              ></img>
              {/* user name & rank */}
              <div className="flex flex-col justify-center items-start">
                <div
                  className={`font-extrabold text-lg sm:text-xl transition-colors duration-500 ${currentTurn === "w" ? "text-stone-100" : "text-slate-400"}`}
                >
                  {state.user ? state.user?.username : "Player 1"}
                </div>
                <div
                  className={`font-bold text-xs sm:text-sm tracking-wide transition-colors duration-500 ${currentTurn === "w" ? "text-emerald-300" : "text-slate-500"}`}
                >
                  GRANDMASTER
                </div>
              </div>
            </div>
            <Timer
              key={timerKey}
              startTimerInSeconds={30}
              isRunning={currentTurn === color}
            />

            {/* VS / result */}
            <div className="flex flex-col items-center px-1 sm:px-2 shrink-0">
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold tracking-widest mb-1">
                MATCH
              </span>
              <div className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-teal-300">
                VS
              </div>
            </div>

            <Timer
              key={timerKey + 1}
              startTimerInSeconds={30}
              isRunning={currentTurn !== color}
            />

						{/* right user */}
						<div
							className={`flex flex-row items-center gap-3 sm:gap-4 p-2 sm:px-4 sm:py-2 rounded-xl transition-all duration-500 ${
								currentTurn !== color
									? "bg-emerald-500/14 ring-1 ring-emerald-300/35 scale-[1.03]"
									: "opacity-65 scale-100"
							}`}>
							{/* user name & rank */}
							<div className="hidden sm:flex sm:flex-col sm:justify-center sm:items-end">
								<div
									className={`font-extrabold text-lg sm:text-xl transition-colors duration-500 ${currentTurn === "b" ? "text-stone-100" : "text-slate-400"}`}>
									Opponent
								</div>
								<div
									className={`font-bold text-xs sm:text-sm tracking-wide transition-colors duration-500 ${currentTurn === "b" ? "text-emerald-300" : "text-slate-500"}`}>
									BEGINNER
								</div>
							</div>
							{/* image */}
							<div
								className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-800 flex items-center justify-center ring-4 text-2xl sm:text-3xl shadow-lg transition-all duration-500 ${
									currentTurn !== color
										? "ring-emerald-300 shadow-emerald-700/20 opacity-100"
										: "ring-slate-700 shadow-none border border-slate-600"
								}`}>
								🤖
							</div>
						</div>
					</div>
					{/* Container Board && Chat */}
					{/* Container Board && Chat (board preserved) */}
					<div>
						{/* Board */}
						<GameActions/>
						<div className="w-full max-w-2xl px-2">
							<div className="p-3 sm:p-6 bg-stone-900/75 rounded-2xl border border-emerald-300/15 shadow-[0_20px_45px_-24px_rgba(0,0,0,0.9)] ring-1 ring-white/5 backdrop-blur-md">
								<Board onTurnChange={handleTurnChange} />
							</div>
						</div>
					</div>
					<div className="hidden xl:block absolute right-6 top-1/2 z-10 -translate-y-1/3">
						<Chat />
					</div>
				</div>
			</div>
		</div>
	);
}
