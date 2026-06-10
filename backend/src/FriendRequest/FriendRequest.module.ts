import { Module } from '@nestjs/common';
import { FriendRequestController } from './FriendRequest.controller';
import { FriendRequestService } from './FriendRequest.service';
import { PrismaService } from 'src/prisma/prisma.service'; // Confirma se o caminho do teu PrismaService é este
import { AchievementsModule } from 'src/achievements/achievements.module';
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [WebsocketsModule, PrismaModule, AchievementsModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService, PrismaService],
})
export class FriendRequestModule {}
