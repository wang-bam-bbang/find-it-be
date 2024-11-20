import { Controller, Get, UseGuards, Res, Query } from '@nestjs/common';

import { Response } from 'express';
import { UserService } from './user.service';
import { IdPGuard } from './guard/idp.guard';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '@prisma/client';
import { UserInfoResDto } from './dto/res/userInfoRes.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('login')
  async loginByIdP(@Res({ passthrough: true }) res: Response) {
    const idpLoginUrl = await this.userService.getIdpLoginUrl();

    return res.redirect(idpLoginUrl);
  }

  @Get('callback')
  async idpAuthCallback(
    @Query() code: string,
    @Res({ passthrough: true }) res: Response,
  ) {
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
  async getUserInfo(@GetUser() user: User): Promise<UserInfoResDto> {
    return user;
  }
}
