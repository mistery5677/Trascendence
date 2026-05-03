import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

// @Controller('matches')
// export class MatchesController {
//   constructor(private readonly matchesService: MatchesService) {}

  @Post('end')
  async saveMatchResult(
    @Body() body: { playerAId: number; playerBId: number; result: string }
  ) {
    // Return all the information
    return this.matchesService.saveMatchResult(
      body.playerAId, 
      body.playerBId, 
      body.result
    );
  }

  @UseGuards(AuthGuard) // Checks for the user token
  @Get('history')
  async getHistory(@Req() req) {
    const userId = req.user.userId; // The guard checks for the user ID
    return await this.matchesService.getUserMatchHistory(userId);
  }
}
