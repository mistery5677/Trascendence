import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async saveMatchResult(
    playerWId: number,
    playerBId: number,
    winnerId: number | null,
  ) {
    // Save the information in the Match History
    const match = await this.prisma.matchHistory.create({
      data: {
        playerAId: playerWId,
        playerBId: playerBId,
        result: winnerId ? `WINNER_ID_${winnerId}` : 'DRAW',
      },
    });

    if (winnerId === null) {
      await Promise.all([
        this.prisma.user.update({
          where: { id: playerWId },
          data: { draws: { increment: 1 } },
        }),
        this.prisma.user.update({
          where: { id: playerBId },
          data: { draws: { increment: 1 } },
        }),
      ]);
      return { message: 'Match saved (Draw)', matchId: match.id };
    }

    const loserId = winnerId === playerWId ? playerBId : playerWId;

    await Promise.all([
      this.prisma.user.update({
        where: { id: winnerId },
        data: { wins: { increment: 1 }, elo: { increment: 8 } },
      }),

      this.prisma.user.update({
        where: { id: loserId },
        data: { losses: { increment: 1 }, elo: { decrement: 8 } },
      }),
    ]);

    return { message: 'Match saved', matchId: match.id };
  }
}
