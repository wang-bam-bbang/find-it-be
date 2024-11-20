import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
// import { ConfigService } from '@nestjs/config';
import { IdpService } from 'src/idp/idp.service';
import { UserService } from '../user.service';
import { UserInfo } from 'src/idp/types/userInfo.type';

@Injectable()
export class IdpStrategy extends PassportStrategy(Strategy, 'idp') {
  constructor(
    private idpService: IdpService,
    private userService: UserService,
  ) {
    super();
  }

  async validate(accessToken: string): Promise<{
    idpUserInfo: UserInfo;
    findIt: UserInfo;
    accessToken: string;
  }> {
    const idpUserInfo = await this.idpService
      .getUserInfo(accessToken)
      .catch(() => {
        throw new UnauthorizedException();
      });

    const findIt = await this.userService
      .findUserOrCreate({
        uuid: idpUserInfo.uuid,
        name: idpUserInfo.name,
      })
      .catch(() => {
        throw new UnauthorizedException();
      });

    return {
      idpUserInfo,
      findIt,
      accessToken,
    };
  }
}
