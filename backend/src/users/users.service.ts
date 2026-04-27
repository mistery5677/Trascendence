import {
  ForbiddenException,
  Injectable,
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
    if (!username) return null;
    return this.prisma.user.findUnique({ where: { username: username } });
  }
  async findOneByEmail(email: string) {
    if (!email) return null;
    return this.prisma.user.findUnique({ where: { email: email } });
  }

  async updateAvatar(email: string, avatarUrl: string) {
    const user = await this.findOneByEmail(email);

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

  async updateBoardTheme(email: string, boardTheme: number) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // !For now
    if (boardTheme < 1 || boardTheme > 3)
      throw new ForbiddenException("Theme with that index doesn't exist");

    return await this.prisma.user.update({
      where: { email },
      data: { boardTheme: boardTheme },
    });
  }

  async updateUsername(userEmail: string, newUsername: string) {
    const user = await this.findOneByEmail(userEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existingUser = await this.findOneByUsername(newUsername);

    if (existingUser && existingUser.id !== user.id) {
      throw new ForbiddenException('Username already on use');
    }

    return await this.prisma.user.update({
      where: { email: userEmail },
      data: { username: newUsername },
    });
  }

  async updateEmail(currentEmail: string, newEmail: string) {
    const user = await this.findOneByEmail(currentEmail);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const existingUser = await this.findOneByEmail(newEmail);

    if (existingUser && existingUser.id !== user.id) {
      throw new ForbiddenException('Email already on use');
    }

    return await this.prisma.user.update({
      where: { email: currentEmail },
      data: { email: newEmail },
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
        createdAt: true,
        name: true,
        boardTheme: true,
        draws: true,
        updatedAt: true,
      },
    });
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

  // Find all the users to create the leaderboard
  async getLeaderboard() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        elo: true,
        wins: true,
        losses: true,
      },
      orderBy: {
        elo: 'desc', // Orders the elos in a decrescent way
      },
      take: 10, // Limits to 10 to not overload the data base
    });

    // Calculate the position of each user
    return users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  }
}
