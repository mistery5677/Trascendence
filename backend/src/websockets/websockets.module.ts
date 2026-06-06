import { Module } from '@nestjs/common';
import { GameGateway } from './gateways/game.gateway';
import { MatchMakingService } from './services/matchmaking.service';
import { GameService } from './services/game.service';
import { MatchesModule } from 'src/matches/matches.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './gateways/chat.gateway';
import { PresenceGateway } from './gateways/presence.gateway';
import { PresenceService } from './services/presence.service';
import { MatchGateway } from './gateways/match.gateway';
import { PresenceController } from './controllers/presence.controller';
import { StockfishModule } from 'src/stockfish/stockfish.module';

@Module({
  imports: [MatchesModule, UsersModule, StockfishModule],
  providers: [
    GameService,
    GameGateway,
    ChatGateway,
    PresenceGateway,
    PresenceService,
    MatchGateway,
    MatchMakingService,
  ],
  controllers: [PresenceController],
})
export class WebsocketsModule {}
