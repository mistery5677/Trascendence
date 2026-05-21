import { Controller, UseGuards, Get, Req, Param } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('history')
  async getHistory(@Req() req) {
    const userId = req.user.userId; // The guard checks for the user ID
    return await this.matchesService.getUserMatchHistory(userId);
  }

  @Get('player/:username') // The username that we want to check the match history
  async getHistoryByUsername(@Param('username') username: string) {
    return await this.matchesService.getUserMatchHistoryByUsername(username);
  }
}
