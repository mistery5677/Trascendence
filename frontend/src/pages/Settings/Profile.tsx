import { useAuth } from "../../contexts/UserContext";
import { TitleFrame } from "../../components/TitleFrame/TitleFrame";
import { displayElo } from "../../utils/displayElo";
import { Trophy, Swords, Equal } from "lucide-react";
import { ProfileHeader } from "../../components";

const BACKGROUND_THEMES: Record<number, string> = {
	1: "Chess",
	2: "Cats",
	3: "Sky",
	4: "Penguin",
	5: "Standard",
};

export function Profile() {
	const { state } = useAuth();
	const user = state.user;

	const boardThemeName = (themeId: 1 | 2 | 3 | undefined) => {
		switch (themeId) {
			case 1:
				return "Forest";
			case 2:
				return "Classic";
			case 3:
				return "Midnight";
			default:
				return "Unknown";
		}
	};

	const userThemeId = state.user?.backgroundTheme || 1;
	const selectedBackground = BACKGROUND_THEMES[userThemeId] || "Chess";

	return (
		<main className="w-full max-w-5xl mx-auto px-4 py-12 text-stone-100">
			{/* Premium Header Summary Card */}
			<ProfileHeader
				user={user}
				boardThemeName={boardThemeName}
				backgroundName={selectedBackground}
			/>

			{/* Premium Dynamic Statistics Grid */}
			<section className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
				<div
					className="bg-stone-900/20 hover:bg-stone-900/40 p-5 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 flex flex-col gap-2 shadow-sm group items-center"
					style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}>
					<div className="flex items-center justify-between">
						<p className="text-stone-400 group-hover:text-emerald-400 text-[10px] font-bold uppercase tracking-wider transition-colors">
							Victories
						</p>
						<Trophy
							className="text-emerald-400/70"
							size={14}
						/>
					</div>
					<p className="font-mono text-4xl font-black text-green-400">{user?.score?.wins || 0}</p>
				</div>

				<div
					className="bg-stone-900/20 hover:bg-stone-900/40 p-5 border border-red-500/10 hover:border-red-500/20 transition-all duration-300 flex flex-col gap-2 shadow-sm group items-center"
					style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}>
					<div className="flex items-center justify-between">
						<p className="text-stone-400 group-hover:text-red-400 text-[10px] font-bold uppercase tracking-wider transition-colors">
							Defeats
						</p>
						<Swords
							className="text-red-400/70"
							size={14}
						/>
					</div>
					<p className="font-mono text-4xl font-black text-red-400">{user?.score?.losses || 0}</p>
				</div>

				<div
					className="bg-stone-900/20 hover:bg-stone-900/40 p-5 border border-yellow-500/10 hover:border-yellow-500/20 transition-all duration-300 flex flex-col gap-2 shadow-sm group items-center"
					style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}>
					<div className="flex items-center justify-between">
						<p className="text-stone-400 group-hover:text-yellow-400 text-[10px] font-bold uppercase tracking-wider transition-colors">
							Draws
						</p>
						<Equal
							className="text-yellow-400/70"
							size={14}
						/>
					</div>
					<p className="font-mono text-4xl font-black text-yellow-400">{user?.score?.draws || 0}</p>
				</div>

				<div
					className="bg-stone-900/20 hover:bg-stone-900/40 p-5 border border-emerald-500/20 shadow-md shadow-emerald-950/10 flex flex-col gap-2 group"
					style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}>
					<p className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-wider">Elo Rating</p>
					<p className="font-mono text-4xl font-black text-white tracking-tight">
						{user?.score?.elo || 1000}
					</p>
				</div>
			</section>
		</main>
	);
}
