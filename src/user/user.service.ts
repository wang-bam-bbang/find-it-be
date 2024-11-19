import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IdpService } from 'src/idp/idp.service';
import { UserRepository } from './user.repository';
import { JwtTokenType } from './types/jwtToken.type';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private prismaService: PrismaService,
    private idpService: IdpService,
    private userRepository: UserRepository,
  ) {}

  async getIdpLoginUrl(): Promise<string> {
    const idpUrl = 'https://idp.gistory.me';
    const clientId = this.configService.get<string>('IDP_CLIENT_ID');
    const redirectUrl = this.configService.get<string>('IDP_CALLBACK_URL');
    const responseType = 'code';
    const scope = 'openid profile offline_access';
    const state = this.configService.get<string>('IDP_STATE');

    const idpLoginUrl = `${idpUrl}/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}&state=${state}&prompt=consent`;

    return idpLoginUrl;
  }

  async login(code: string) {
    const tokens = await this.idpService.getAccessToken(code);

    const userInfo = await this.idpService.getUserInfo(tokens.access_token);

    const user = await this.userRepository.findUserOrCreate({
      uuid: userInfo.uuid,
      name: userInfo.name,
    });

    console.log(tokens);

    return {
      ...tokens,
      name: user.name,
    };
  }

  async refresh(refreshToken: string): Promise<JwtTokenType> {
    const tokens = await this.idpService.refresh(refreshToken);
    return {
      ...tokens,
    };
  }

  async findUserOrCreate({ uuid, name }) {
    const user = await this.prismaService.user.findUnique({
      where: { uuid },
    });

    if (user) {
      return user;
    }
    return this.prismaService.user.create({
      data: {
        uuid,
        name,
      },
    });
  }
}
