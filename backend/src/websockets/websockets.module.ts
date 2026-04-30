import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MatchMakingService } from './matchmaking/matchmaking.service';
import { GameService } from './game.service';

@Module({
  providers: [GameService, GameGateway, MatchMakingService],
})
export class WebsocketsModule {}
