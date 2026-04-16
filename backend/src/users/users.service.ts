import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

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

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
      },
    });
  }
  //! Example for updates
  //   update(id: number, updateUserDto: UpdateUserDto) {
  //     return `This action updates a #${id} user`;
  //   }

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
