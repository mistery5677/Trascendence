import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/signup')
  signup(@Body() registerDto: RegisterDto) {
    return this.authService.signup(registerDto);
  }

// Example of use Guards
//   @Get('profile')
//   @UseGuards(AuthGuard)
//   profile() {
//     return 'profile';
//   }
}
