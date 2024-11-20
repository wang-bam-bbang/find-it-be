import {
  Controller,
  Get,
  UseGuards,
  Res,
  Query,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { Response, Request } from 'express';
import { UserService } from './user.service';
import { IdPGuard } from './guard/idp.guard';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '@prisma/client';
import { UserInfoResDto } from './dto/res/userInfoRes.dto';
import { LoginCallbackDto } from './dto/req/callBack.dto';
import { JwtTokenResDto } from './dto/res/jwtTokenRes.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('login')
  async loginByIdP(): Promise<string> {
    const idpLoginUrl = await this.userService.getIdpLoginUrl();

    return idpLoginUrl;
  }

  @Get('callback')
  async idpAuthCallback(
    @Query() { code }: LoginCallbackDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtTokenResDto> {
    const { access_token, refresh_token } = await this.userService.login({
      code,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { access_token };
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<JwtTokenResDto> {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException();

    const { access_token, refresh_token } =
      await this.userService.refresh(refreshToken);

    if (refresh_token) {
      res.cookie('refresh_token', refresh_token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    }
    return { access_token };
  }

  @Get('info')
  @UseGuards(IdPGuard)
  async getUserInfo(@GetUser() user: User): Promise<UserInfoResDto> {
    return user;
  }
}
