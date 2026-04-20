import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MatchMakingService } from './matchmaking/matchmaking.service';

@Module({
  providers: [GameGateway, MatchMakingService],
})
export class WebsocketsModule {}
