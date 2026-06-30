import { Injectable, NotFoundException } from '@nestjs/common';
import { stringify } from 'querystring';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class MatchesService {
  constructor(
    private prisma: PrismaService,
    private achievementsService: AchievementsService,
  ) {}

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
        this.prisma.score.update({
          where: { userId: playerWId },
          data: { draws: { increment: 1 }, totalGames: { increment: 1 } },
        }),
        this.prisma.score.update({
          where: { userId: playerBId },
          data: { draws: { increment: 1 }, totalGames: { increment: 1 } },
        }),
      ]);
      return { message: 'Match saved (Draw)', matchId: match.id };
    }

    const loserId = winnerId === playerWId ? playerBId : playerWId;

    const [updatedWinnerUser] = await Promise.all([
      this.prisma.user.update({
        where: { id: winnerId },
        data: {
          score: {
            update: {
              wins: { increment: 1 },
              elo: { increment: 8 },
              totalGames: { increment: 1 },
            },
          },
        },
        include: { score: true },
      }),
      this.prisma.score.update({
        where: { userId: loserId },
        data: {
          losses: { increment: 1 },
          elo: { decrement: 8 },
          totalGames: { increment: 1 },
        },
      }),
    ]);

    const winnerScore = updatedWinnerUser.score!;

    if (winnerScore.elo > winnerScore.bestElo) {
      console.log(
        'Updating bestElo for user',
        winnerId,
        'from',
        winnerScore.bestElo,
        'to',
        winnerScore.elo,
      );

      await this.prisma.score.update({
        where: { userId: winnerId },
        data: { bestElo: winnerScore.elo },
      });
    }
    // Check the first win achievement
    await this.achievementsService.checkFirstWin(winnerId);

    // Check the grandmaster achievement
    await this.achievementsService.checkGrandMaster(winnerId, winnerScore.elo);

    return { message: 'Match saved', matchId: match.id };
  }

  // Get the information of the match
  async getUserMatchHistory(userId: number) {
    return await this.prisma.matchHistory.findMany({
      where: {
        OR: [
          { playerAId: userId }, // User of the white pieces
          { playerBId: userId }, // User of the black pieces
        ],
      },
      orderBy: { createdAt: 'desc' }, // Order the match from the oldest one
      include: {
        // Get the username of the users
        playerA: { select: { username: true } },
        playerB: { select: { username: true } },
      },
    });
  }

  // Get the match history of the username
  async getUserMatchHistoryByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    return await this.getUserMatchHistory(user.id);
  }
}
