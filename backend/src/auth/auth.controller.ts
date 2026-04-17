import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import type { Response } from 'express';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return { message: 'Logged out' };
  }

  // Example of use Guards
  @Get('profile')
  @UseGuards(AuthGuard)
  profile() {
    return 'profile';
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req) {
    return await this.authService.getProfile(req.user.user);
    // const user = await this.use
  }
}

// @Get('me')
// @UseGuards(AuthGuard)
// async getProfile(@Req() req) {
//   // El payload del JWT que guardaste en el Guard está en req.user
//   // Buscamos al usuario completo en la DB para tener el avatar, username, etc.
//   const user = await this.usersService.findOneByEmail(req.user.user);

//   // Retornamos solo lo necesario (¡nunca la contraseña!)
//   return {
//     username: user.username,
//     email: user.email,
//     avatar: user.avatarUrl,
//     createdAt: user.createdAt,
//   };
// }
