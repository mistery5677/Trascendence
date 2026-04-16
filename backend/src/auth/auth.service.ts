import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByIdentity(loginDto.identity);

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const isMatch = await bcryptjs.compare(loginDto.password, user.password);

    if (!isMatch) {
      console.log('Wrong Password');
      throw new UnauthorizedException('Invalid Credentials');
    }

    const payload = { user: user.email };

    const token = await this.jwtService.signAsync(payload);

    return { token, email: user.email };
  }

  async signup(registerDto: RegisterDto) {
    const userByEmail = await this.usersService.findOneByEmail(
      registerDto.email,
    );

    if (userByEmail) {
      throw new BadRequestException('User with this email already exist');
    }

    const userByUsername = await this.usersService.findOneByUsername(
      registerDto.username,
    );

    if (userByUsername) {
      throw new BadRequestException('User with this username already exist');
    }
    const { password, ...rest } = registerDto;

    //Password Encryption
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    return await this.usersService.create({
      ...rest,
      password: hashedPassword,
    });
  }
}
