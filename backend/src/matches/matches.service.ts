import { Injectable, NotFoundException } from '@nestjs/common';
import { stringify } from 'querystring';
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

  // Get the information of the match
  async getUserMatchHistory(userId: number) {
    return await this.prisma.matchHistory.findMany({
      where: {
        OR: [
          { playerAId : userId }, // User of the white pieces
          { playerBId : userId}, // User of the black pieces
        ],
      },
      orderBy: { createdAt: 'desc' }, // Order the match from the oldest one
      include: {
        // Get the username of the users
        playerA: { select: { username: true } },
        playerB: { select: { username: true } }
      }
    })
  }

  // Get the match history of the username
  async getUserMatchHistoryByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });
  
    if (!user){
      throw new NotFoundException("User doesn't exist");
    }

    return await this.getUserMatchHistory(user.id);
  }
}
