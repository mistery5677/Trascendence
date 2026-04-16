import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true,}), UsersModule, AuthModule], //Allows to all variables be accessed
  controllers: [],
  providers: [],
})
export class AppModule {}
