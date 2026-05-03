interface MatchmakingLoadingProps {
  isConnected: boolean;
}

export const MatchmakingLoading = ({
  isConnected,
}: MatchmakingLoadingProps) => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-[20%] -left-[10%] w-[36vw] h-[36vw] bg-emerald-700/20 rounded-full blur-[110px]"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-emerald-500/12 rounded-full blur-[95px]"></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-6 animate-pulse">
        <div className="relative">
          {/* Spinner Ring */}
          <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            ♟️
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Searching for Opponent...
          </h2>
          <p className="text-slate-400 font-medium">
            {isConnected
              ? "Connecting to Matchmaking..."
              : "Connecting to Server..."}
          </p>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="mt-4 px-8 py-2.5 bg-slate-800/50 hover:bg-red-900/40 text-slate-300 hover:text-red-200 border border-slate-700 hover:border-red-500/50 rounded-xl transition-all duration-300 backdrop-blur-sm font-semibold"
        >
          Cancel Search
        </button>
      </div>
    </div>
  );
};
