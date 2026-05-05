import { Module } from '@nestjs/common';
// import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { PrismaService } from 'src/prisma.service'; // Confirma se o caminho do teu PrismaService é este
import { MatchesController } from './matches.controller';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService, PrismaService],
  exports: [MatchesService],
})
export class MatchesModule {}
