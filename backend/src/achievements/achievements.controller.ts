import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';

@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get('me')
  async getMyAchievements(@Req() req: any) {
    const userId = req.user.userId; 
    if (!userId) return [];
    const unlockedIds = await this.achievementsService.getUserUnlockedAchievements(userId);
    return unlockedIds; // Returns the name of the achievement
  }
}