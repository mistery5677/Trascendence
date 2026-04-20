import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'node:path';
import { diskStorage } from 'multer';
import type { Request } from 'express';
import { Console } from 'node:console';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/me/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './assets/avatars/uploaded',
        filename: (req, file, cb) => {
          const user = (req as any).user;
          if (!user) return cb(new Error('Unauthorized'), '');
          const filename = `user_${user.userId}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('File not received Correctly');
    }
    const userEmail = req.user.userEmail;

    const avatarUrl = `/assets/avatars/uploaded/${file.filename}`;

    console.log(avatarUrl);
    return await this.usersService.updateAvatar(userEmail, avatarUrl);
  }

  @UseGuards(AuthGuard)
  @Patch('me/password')
  async updatePassword(@Body() body, @Req() req) {
    const { currentPassword, newPassword } = body;
    const userEmail = req.user.userEmail;
    return await this.usersService.updatePassword(
      userEmail,
      currentPassword,
      newPassword,
    );
  }
}
