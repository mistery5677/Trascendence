import {
  BadRequestException,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('notification')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('')
  async getNotification(@Req() req: any) {
    const userId = Number(req.user.userId);
    if (!userId || Number.isNaN(userId)) {
      throw new BadRequestException('User session is invalid or unauthorized');
    }

    return await this.notificationService.getUserNotifications(userId);
  }

  @Patch('read-all')
  async readAllNotifications(@Req() req: any) {
    const userId = Number(req.user.userId);
    if (!userId || Number.isNaN(userId)) {
      throw new BadRequestException('User session is invalid or unauthorized');
    }

    return await this.notificationService.markAllAsRead(userId);
  }
}
