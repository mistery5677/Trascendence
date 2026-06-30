export type Match = {
	createdAt: string;
	gameId: number;
	opponent: string;
	playedAs: "White" | "Black";
	result: "WIN" | "LOSS" | "DRAW";
};
