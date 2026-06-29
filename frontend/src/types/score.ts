export type Score = {
	wins: number;
	losses: number;
	draws: number;
	elo: number;
	bestElo: number;
	currentStreak: number;
	totalGames: number; // total number of games played
};
