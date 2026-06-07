export type StockfishAnalysisResponse = {
	bestMove: string;
	depth?: number;
	positionEvaluation?: string;
	possibleMate?: string;
	pv?: string;
};

export async function analyzePosition(
	fen: string,
	options?: { level?: number; moveTimeMs?: number; signal?: AbortSignal },
): Promise<StockfishAnalysisResponse> {
	const response = await fetch("/api/stockfish/analyze", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			fen,
			level: options?.level ?? 5,
			moveTimeMs: options?.moveTimeMs ?? 400,
		}),
		signal: options?.signal,
	});

	if (!response.ok) {
		throw new Error(`Stockfish analyze failed with status ${response.status}`);
	}

	return response.json() as Promise<StockfishAnalysisResponse>;
}
