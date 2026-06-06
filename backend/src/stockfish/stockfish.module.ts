import { Global, Module } from '@nestjs/common';
import { StockfishService } from './stockfish.service';

@Module({
  providers: [StockfishService],
  exports: [StockfishService],
})
export class StockfishModule {}
