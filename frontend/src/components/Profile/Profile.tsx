import { useAuth } from "../../contexts/UserContext";
import { TitleFrame } from "../TitleFrame/TitleFrame";
import frame from "../../assets/title.png";
import { displayElo } from "../../utils/displayElo";

const BACKGROUND_THEMES: Record<number, string> = {
    1: "Chess",
    2: "Cat",
    3: "Sky",
};

export function Profile() {
    const { state } = useAuth();
    const user = state.user;

    const boardThemeName = (themeId: 1 | 2 | 3 | undefined) => {
        switch (themeId) {
            case 1: return "Forest";
            case 2: return "Classic";
            case 3: return "Midnight";
            default: return "Unknown";
        }
    };

    const userThemeId = state.user?.backgroundTheme || 1;
    const selectedBackground = BACKGROUND_THEMES[userThemeId] || "Chess";

    return (
        <main className="w-full max-w-5xl mx-auto px-4 py-12 text-stone-100">
            {/* Premium Header Summary Card */}
            <header className="relative overflow-hidden mb-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-stone-900/40 p-6 sm:p-8 rounded-2xl border border-white/5 shadow-xl backdrop-blur-md">
                {/* Visual Accent Backglow */}
                <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                
                {/* Left: Avatar & Username Combo */}
                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
                    <div className="relative shrink-0">
                        <img
                            src={user?.avatarUrl ? `${user.avatarUrl}` : "/api/assets/avatars/default1.png"}
                            alt="Profile avatar"
                            className="h-28 w-28 rounded-full border border-emerald-400/30 object-fit shadow-2xl ring-4 ring-emerald-500/5"
                            onError={(e) => {
                                e.currentTarget.src = "/api/assets/avatars/default1.png";
                            }}
                        />
                    </div>
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-2 flex-1 min-w-0">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white truncate w-full max-w-[18ch]">
                            {user?.username || "Player"}
                        </h1>
                        <div className="inline-flex items-center text-[clamp(0.65rem,0.72vw,1rem)] font-bold tracking-wider text-emerald-300 min-w-35 max-w-full">
                            <TitleFrame frame={frame}>
                                {displayElo(user?.score?.elo as number) || "UNKNOWN RANK"}
                            </TitleFrame>
                        </div>
                    </div>
                </div>

                {/* Right: Clean Preferences Meta Grid */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 md:flex md:flex-col gap-4 md:gap-2 w-full md:w-auto pt-6 md:pt-0 border-t md:border-t-0 border-white/10 sm:text-center md:text-right">
                    <div className="flex flex-col md:items-end">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Account Contact</span>
                        <span className="text-sm font-semibold text-stone-200 truncate max-w-[22ch]">{user?.email || "—"}</span>
                    </div>
                    <div className="flex flex-col md:items-end">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Board Style</span>
                        <span className="text-sm font-semibold text-emerald-400">{boardThemeName(user?.boardTheme)}</span>
                    </div>
                    <div className="flex flex-col md:items-end">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500">Background View</span>
                        <span className="text-sm font-semibold text-stone-200">{selectedBackground}</span>
                    </div>
                </div>
            </header>

            {/* Premium Dynamic Statistics Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                <div className="bg-stone-900/20 hover:bg-stone-900/40 p-5 rounded-xl text-center border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-center shadow-sm group">
                    <p className="text-stone-400 group-hover:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1 transition-colors">Victories</p>
                    <p className="text-4xl font-black text-green-400">{user?.score?.wins || 0}</p>
                </div>
                
                <div className="bg-stone-900/20 hover:bg-stone-900/40 p-5 rounded-xl text-center border border-red-500/10 hover:border-red-500/20 transition-all duration-300 flex flex-col justify-center shadow-sm group">
                    <p className="text-stone-400 group-hover:text-red-400 text-xs font-bold uppercase tracking-wider mb-1 transition-colors">Defeats</p>
                    <p className="text-4xl font-black text-red-400">{user?.score?.losses || 0}</p>
                </div>
                
                <div className="bg-stone-900/20 hover:bg-stone-900/40 p-5 rounded-xl text-center border border-yellow-500/10 hover:border-yellow-500/20 transition-all duration-300 flex flex-col justify-center shadow-sm group">
                    <p className="text-stone-400 group-hover:text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1 transition-colors">Draws</p>
                    <p className="text-4xl font-black text-yellow-400">{user?.score?.draws || 0}</p>
                </div>
                
                <div className="bg-stone-900/20 hover:bg-stone-900/40 p-5 rounded-xl text-center border border-emerald-500/20 shadow-md shadow-emerald-950/10 flex flex-col justify-center group">
                    <p className="text-emerald-400/80 text-xs font-bold uppercase tracking-wider mb-1">Elo Rating</p>
                    <p className="text-4xl font-black text-white tracking-tight">{user?.score?.elo || 1000}</p>
                </div>
            </section>
        </main>
    );
}