import { Controller, Get, UseGuards, Res, Query } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserService } from './user.service';
import { IdPGuard } from './guard/idp.guard';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get('login')
  @UseGuards(AuthGuard('idp'))
  async loginByIdP() {}

  @Get('callback')
  async idpAuthCallback(@Query() { code }, @Res() res: Response) {
    console.log(code);
    const { access_token, refresh_token, name } =
      await this.userService.login(code);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { access_token, name };
  }

  @Get('info')
  @UseGuards(IdPGuard)
  async getUserInfo(@GetUser() user: User) {
    return user;
  }
}
