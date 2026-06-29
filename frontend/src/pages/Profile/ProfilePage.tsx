import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/UserContext";
import { ProfileTabs, ProfileHeader, ProfileOverview, MatchHistory, ProfileStats } from "../../components";
import { userToProfileStats } from "../../mappers/userToProfileStats";
import type { ProfileStatsVM } from "../../models/profileStats";

const BACKGROUND_THEMES: Record<number, string> = {
	1: "Chess",
	2: "Cats",
	3: "Sky",
	4: "Penguin",
	5: "Standard",
};

export function ProfilePage() {
	const { username } = useParams<{ username: string }>();

	const { state } = useAuth(); // Get the logged user
	const myUsername = state?.user?.username;

	const user = state?.user; // Get the logged user

	console.log("ProfilePage: Best elo:", user?.score?.bestElo);

	useEffect(() => {
		document.title = "Profile | 42 Transcendence";
	}, []);

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

	const [tab, setTab] = useState<"overview" | "history" | "stats">("overview");

	const profileStats: ProfileStatsVM = userToProfileStats(user);

	console.log("ProfilePage: Profile stats:", profileStats);

	return (
		<>
			<main className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden px-4 py-10 text-stone-100 bg-stone-900">
				<div className="pointer-events-none absolute -top-28 -left-20 h-80 w-80 rounded-full bg-stone-400/20 blur-3xl" />
				<div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-amber-200/10 blur-3xl" />
				<div className="pointer-events-none absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-stone-600/20 blur-3xl" />

				<div className="relative mx-auto w-full lg:w-[60%] rounded-3xl border border-stone-200/20 bg-stone-200/10 p-8 shadow-[0_30px_80px_rgba(28,25,23,0.7)] backdrop-blur-2xl">
					<ProfileHeader
						user={user}
						boardThemeName={boardThemeName}
						backgroundName={selectedBackground}
					/>
					<ProfileTabs
						activeTab={tab}
						onChange={setTab}
					/>
					{tab === "overview" && (
						<div>
							<ProfileOverview
								stats={profileStats}
								recentMatches={[
									{
										id: "1",
										opponent: "Alice",
										result: "win",
										eloChange: 18,
										date: "Yesterday",
									},
									{
										id: "2",
										opponent: "Bob",
										result: "draw",
										eloChange: 0,
										date: "2 days ago",
									},
									{
										id: "3",
										opponent: "Charlie",
										result: "loss",
										eloChange: -22,
										date: "1 week ago",
									},
								]}
							/>
						</div>
					)}

					{tab === "history" && (
						<MatchHistory
							matches={[
								{
									id: "1",
									opponent: "Alice",
									result: "win",
									eloChange: 18,
									date: "Yesterday",
									mode: "Ranked",
									score: "3-1",
								},
								{
									id: "2",
									opponent: "Bob",
									result: "draw",
									eloChange: 0,
									date: "2 days ago",
									mode: "Ranked",
									score: "1-3",
								},
								{
									id: "3",
									opponent: "Charlie",
									result: "loss",
									eloChange: -12,
									date: "1 week ago",
								},
							]}
						/>
					)}

					{tab === "stats" && (
						<div>
							<ProfileStats stats={{ totalGames: 0, wins: 0, losses: 0, winRate: 0 }} />
						</div>
					)}
				</div>
			</main>
		</>
	);
}
