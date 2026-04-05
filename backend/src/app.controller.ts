import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

// Font to do it: https://docs.nestjs.com/controllers
@Controller() // Helps to group some related routes ... in this case we are doing for the user
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Route of the user
  @Get('users')
  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  // Route to create a user
  @Post('users')
  async createUser() {
    return this.prisma.user.create({
      data: {
        email: 'jogador1@42.pt',
        username: 'Kasparov',
        password: 'password_super_secreta',
      },
    });
  }
}
