import type { User } from "../types/index";
import type { ProfileStatsVM } from "../models/profileStats";
import { getWinRate } from "../utils/getWinRate";

export function userToProfileStats(user: User | null): ProfileStatsVM {
	const score = user?.score;

	console.log("userToProfileStats: User score:", score);

	if (!score) {
		return {
			totalGames: 0,
			wins: 0,
			losses: 0,
			draws: 0,
			winRate: 0,
			currentElo: 0,
			bestElo: 0,
			bestWinStreak: 0,
			currentStreak: 0,
			averageEloGain: 0,
			averageEloLoss: 0,
		};
	}

	// These 2 DO NOT exist in backend → either:
	// 1. calculate later from match history (best option)
	// 2. or placeholder for now
	const bestWinStreak = score.currentStreak; // temporary fallback
	const currentStreak = score.currentStreak;

	const winRate = getWinRate(score.wins, score.losses);

	return {
		totalGames: score.totalGames,
		wins: score.wins,
		losses: score.losses,
		draws: score.draws,
		winRate: winRate,
		currentElo: score.elo,
		bestElo: score.bestElo,
		bestWinStreak,
		currentStreak,
		averageEloGain: 0, // needs match history
		averageEloLoss: 0, // needs match history
	};
}
