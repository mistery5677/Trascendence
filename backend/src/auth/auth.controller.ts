import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
  Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import type { Response } from 'express';
import { PrismaService } from 'src/prisma.service';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, email } = await this.authService.login(loginDto);

    response.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Login Successful', email };
  }

  @Post('/signup')
  signup(@Body() registerDto: RegisterDto) {
    return this.authService.signup(registerDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req) {
    return req.user; 
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    
    // Procura na base de dados
    const user = await this.prisma.user.findUnique({
      where: { username: username },
    });

    return { isAvailable: !user };
  }

    @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    
    // Procura na base de dados
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    return { isAvailable: !user };
  }
}
