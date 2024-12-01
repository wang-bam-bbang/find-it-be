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
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: 'Get Idp Login Url',
    description:
      'Get Idp Login Url, login it, and redirect to callback api endpoint',
  })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @Get('login')
  async loginByIdP(): Promise<string> {
    const idpLoginUrl = await this.userService.getIdpLoginUrl();

    return idpLoginUrl;
  }

  @ApiOperation({
    summary: 'Callback for Login with idp',
    description:
      'With input authorization code, this endpoint return jwt token to users',
  })
  @ApiOkResponse({ type: JwtTokenResDto, description: 'Return jwt token' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
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

  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh the access token from idp',
  })
  @ApiCookieAuth('refresh_token')
  @ApiCreatedResponse({ type: JwtTokenResDto, description: 'Return jwt token' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
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

  @ApiOperation({
    summary: 'get user info',
    description: 'get user info with token',
  })
  @ApiOkResponse({
    type: UserInfoResDto,
    description: 'Return User Information',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBearerAuth('access-token')
  @Get('info')
  @UseGuards(IdPGuard)
  async getUserInfo(@GetUser() user: User): Promise<UserInfoResDto> {
    return user;
  }
}
