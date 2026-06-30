export type Score = {
	elo: number;
	wins: number;
	losses: number;
	draws: number;
	totalGames: number;
	bestWinStreak: number;
	currentStreak: number;
	averageEloGain: number;
	averageEloLoss: number;
	bestElo: number;
};
