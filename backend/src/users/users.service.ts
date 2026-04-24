import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(registerDto: RegisterDto) {
    console.log(registerDto);
    return this.prisma.user.create({
      data: registerDto,
    });
  }

  async findByIdentity(identity: string) {
    return this.prisma.user.findFirst({
      where: { OR: [{ email: identity }, { username: identity }] },
    });
  }

  async findOneByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username: username } });
  }
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async updateAvatar(email: string, avatarUrl: string) {
    const user = this.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('User not Found');
    }

    return await this.prisma.user.update({
      where: { email },
      data: { avatarUrl: avatarUrl, updatedAt: new Date() },
    });
  }

  async updatePassword(email: string, current: string, newPassword: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcryptjs.compare(current, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Current password doesn't match");
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    return await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword, updatedAt: new Date() },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOneById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        elo: true,
        wins: true,
        losses: true,
        avatarUrl: true,
      },
    })
  }

  async remove(id: number) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
