import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { IdpService } from 'src/idp/idp.service';
import { UserRepository } from './user.repository';
import { JwtTokenType } from './types/jwtToken.type';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginCallbackDto } from './dto/req/callBack.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
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

    const idpLoginUrl = `${idpUrl}/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=${scope}&prompt=consent`;

    return idpLoginUrl;
  }

  async login({ code }: LoginCallbackDto) {
    const tokens = await this.idpService.getAccessToken(code);

    return {
      ...tokens,
    };
  }

  async refresh(refreshToken: string): Promise<JwtTokenType> {
    const tokens = await this.idpService.refresh(refreshToken);
    return {
      ...tokens,
    };
  }

  async findUserOrCreate({
    uuid,
    name,
  }: Pick<User, 'uuid' | 'name'>): Promise<User> {
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
