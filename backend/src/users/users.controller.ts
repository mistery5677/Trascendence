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
  Query,
  Header,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'node:path';
import { diskStorage } from 'multer';
import { brotliDecompress } from 'node:zlib';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  findAll() {
    return this.usersService.findAll();
  }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.usersService.findOne(parseInt(id));
  //   }

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
    const userId = req.user.userId;

    const avatarUrl = `/assets/avatars/uploaded/${file.filename}`;

    console.log(avatarUrl);
    return await this.usersService.updateAvatar(parseInt(userId), avatarUrl);
  }

  @UseGuards(AuthGuard)
  @Patch('me/password')
  async updatePassword(@Body() body, @Req() req) {
    const { currentPassword, newPassword } = body;
    const userId = req.user.userId;
    return await this.usersService.updatePassword(
      parseInt(userId),
      currentPassword,
      newPassword,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('me/board-theme')
  async updateBoardTheme(@Body() body, @Req() req) {
    const userId = req.user.userId;
    const { boardTheme } = body;

    return await this.usersService.updateBoardTheme(
      parseInt(userId),
      parseInt(boardTheme),
    );
  }

  @UseGuards(AuthGuard)
  @Patch('me/email')
  async updateEmail(@Body() body, @Req() req) {
    const userId = req.user.userId;
    const { email } = body;

    return await this.usersService.updateEmail(parseInt(userId), email);
  }

  @UseGuards(AuthGuard)
  @Patch('me/username')
  async updateUsername(@Body() body, @Req() req) {
    const userId = req.user.userId;
    const { username } = body;

    return await this.usersService.updateUsername(parseInt(userId), username);
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    const user = await this.usersService.findOneByUsername(username);

    return { isAvailable: !user };
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const user = await this.usersService.findOneByEmail(email);

    return { isAvailable: !user };
  }

  // Call the getLeaderboard function
  @Get('leaderboard')
  @Header('Cache-Control', 'no-store') // Prevent browser from saving old leaderboards
  async getLeaderboard() {
    return this.usersService.getLeaderboard();
  }

  @Get('search')
  async searchUsers(@Query('username') username: string) {
    return await this.usersService.getUsers(username || '');
  }
}
