import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true,})], //Allows to all variables be accessed
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
