import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true,}), UsersModule, AuthModule, WebsocketsModule], //Allows to all variables be accessed
  controllers: [],
  providers: [],
})
export class AppModule {}
