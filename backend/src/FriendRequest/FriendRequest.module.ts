import { Module } from '@nestjs/common';
import { FriendRequestController } from './FriendRequest.controller';
import { FriendRequestService } from './FriendRequest.service';
import { PrismaService } from 'src/prisma/prisma.service'; // Confirma se o caminho do teu PrismaService é este
import { WebsocketsModule } from 'src/websockets/websockets.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [WebsocketsModule, PrismaModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestModule {}
