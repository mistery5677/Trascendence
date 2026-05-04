import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MatchMakingService } from './matchmaking/matchmaking.service';
import { GameService } from './game.service';
import { MatchesModule } from 'src/matches/matches.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [MatchesModule, UsersModule],
  providers: [GameService, GameGateway, MatchMakingService],
})
export class WebsocketsModule {}
