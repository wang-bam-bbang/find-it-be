import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
// import { ConfigService } from '@nestjs/config';
import { IdpService } from 'src/idp/idp.service';
import { UserService } from '../user.service';

@Injectable()
export class IdpStrategy extends PassportStrategy(Strategy, 'idp') {
  constructor(
    // private readonly configService: ConfigService,
    private idpService: IdpService,
    private userService: UserService,
  ) {
    super();
  }

  async validate(accessToken: string): Promise<any> {
    const idpUserInfo = await this.idpService
      .getUserInfo(accessToken)
      .catch(() => {
        throw new UnauthorizedException();
      });

    console.log('idpInfo');
    console.log(idpUserInfo);

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
