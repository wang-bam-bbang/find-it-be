import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';
import { IdpService } from 'src/idp/idp.service';
import { UserService } from '../user.service';

@Injectable()
export class IdpStrategy extends PassportStrategy(Strategy, 'idp') {
  constructor(
    private readonly configService: ConfigService,
    private idpService: IdpService,
    private userService: UserService,
  ) {
    super({
      authorizationURL: 'https://idp.gistory.me/authorize',
      tokenURL: 'https://api.idp.gistory.me/api/oauth2/token',
      clientID: configService.get<string>('IDP_CLIENT_ID'),
      clientSecret: configService.get<string>('IDP_CLIENT_SECRET'),
      callbackURL: configService.get<string>('IDP_CALLBACK_URL'),
      scope: ['openid', 'profile'],
    });
  }

  async validate(accessToken: string): Promise<any> {
    const idpInfo = await this.idpService.getUserInfo(accessToken);

    const findIt = await this.userService.findUserOrCreate({
      uuid: idpInfo.uuid,
      name: idpInfo.name,
    });

    return {
      idpInfo,
      findIt,
      accessToken,
    };
  }
}
