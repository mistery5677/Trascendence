import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MatchesModule } from './matches/matches.module';
import { FriendRequestModule } from './FriendRequest/FriendRequest.module';
import { WebsocketsModule } from './websockets/websockets.module';
import { PrismaModule } from './prisma/prisma.module';
import { StockfishModule } from './stockfish/stockfish.module';
import { StockfishController } from './stockfish/stockfish.controller';
import { StockfishService } from './stockfish/stockfish.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
	PrismaModule,
    UsersModule,
    AuthModule,
    MatchesModule,
    WebsocketsModule,
    FriendRequestModule,
    StockfishModule,
  ], //Allows to all variables be accessed
  controllers: [StockfishController],
  providers: [StockfishService],
})
export class AppModule {}
