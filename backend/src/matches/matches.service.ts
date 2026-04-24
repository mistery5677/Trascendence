import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async saveMatchResult(playerAId: number, playerBId: number, result: string) {
    // Save the information in the Match History
    const match = await this.prisma.matchHistory.create({
      data: {
        playerAId,
        playerBId,
        result,
      },
    });

    // Who wins, we increment 8 points to the elo
    if (result === 'PLAYER_A_WINS') {

      // Player A wins
      await this.prisma.user.update({
        where: { id: playerAId },
        data: { wins: { increment: 1 }, elo: { increment: 8 } },
      });

      // Player B loss
      await this.prisma.user.update({
        where: { id: playerBId },
        data: { losses: { increment: 1 }, elo: { decrement: 8 } },
      });

    } else if (result === 'PLAYER_B_WINS') {
      
      // Player B wins
      await this.prisma.user.update({
        where: { id: playerBId },
        data: { wins: { increment: 1 }, elo: { increment: 8 } },
      });
      // Player A loss
      await this.prisma.user.update({
        where: { id: playerAId },
        data: { losses: { increment: 1 }, elo: { decrement: 8 } },
      });

    } else { // We increment draws
      await this.prisma.user.update({
        where: { id: playerAId },
        data: { draws: {increment: 1}}
      });

      await this.prisma.user.update({
        where: { id: playerAId },
        data: { draws: {increment: 1}}
      });
    }
    // If it is a draw, we don't add any poits to the player elo

    return { 
      message: 'Match saved', 
      matchId: match.id 
    };
  }
}