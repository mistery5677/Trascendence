import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { StockfishService } from './stockfish.service';

type AnalyzeBody = {
	fen: string;
	level?: number;
	moveTimeMs?: number;
};

@Controller('stockfish')
export class StockfishController {
	constructor(private readonly stockfishService: StockfishService) {}

	@Post('analyze')
	async analyze(@Body() body: AnalyzeBody) {
		const fen = body?.fen;
		if (!fen) {
			throw new BadRequestException('fen is required');
		}

		return this.stockfishService.analyzePosition(
			fen,
			body?.level ?? 5,
			body?.moveTimeMs ?? 400,
		);
	}
}
