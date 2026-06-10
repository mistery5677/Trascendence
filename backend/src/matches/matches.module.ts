import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { PrismaService } from 'src/prisma/prisma.service'; // Confirma se o caminho do teu PrismaService é este
import { MatchesController } from './matches.controller';
import { AchievementsModule } from 'src/achievements/achievements.module';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
  imports: [AchievementsModule]
})
export class MatchesModule {}
