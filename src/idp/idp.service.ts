import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdpJwtResponse, IdpUserInfoResponse } from './types/idp.type';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { UserInfo } from './types/userInfo.type';

@Injectable()
export class IdpService {
  private readonly idpUrl: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.idpUrl = this.configService.get<string>('IDP_URL');
  }

  /**
   * this method is used to get the aceess and refresh tokens from the gsa idp
   * @param code code passed by the user, from the idp
   * @returns accessToken and refreshToken
   */
  async getAccessToken(code: string): Promise<IdpJwtResponse> {
    const tokenResponse = await firstValueFrom(
      this.httpService
        .post<IdpJwtResponse>(
          this.idpUrl + '/oauth/token',
          {
            grant_type: 'authorization_code',
            code,
            redirect_uri: this.configService.get<string>('IDP_CALLBACK_URL'),
            scope: 'openid profile offline_access',
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
              username: this.configService.get<string>('IDP_CLIENT_ID'),
              password: this.configService.get<string>('IDP_CLIENT_SECRET'),
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log('Error details:', error.response?.data);
            if (error instanceof AxiosError && error.response?.status === 401) {
              throw new UnauthorizedException();
            }
            if (error instanceof AxiosError && error.response?.status === 400) {
              throw new BadRequestException(error.response.data);
            }
            throw new InternalServerErrorException(error.response.data);
          }),
        ),
    );

    return tokenResponse.data;
  }
  /**
   * this method is used to get the user info from the idp
   * @param accessToken idp access_token passed by user
   * @returns user information (uuid, name)
   */
  async getUserInfo(accessToken: string): Promise<UserInfo> {
    const userInfoResponse = await firstValueFrom(
      this.httpService
        .get<IdpUserInfoResponse>(this.idpUrl + '/oauth/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log('Error details:', error.response?.data);
            if (error instanceof AxiosError && error.response?.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );

    const { uuid, name } = userInfoResponse.data;
    return { uuid, name };
  }

  async refresh(refreshToken: string): Promise<IdpJwtResponse> {
    const tokenResponse = await firstValueFrom(
      this.httpService
        .post<IdpJwtResponse>(
          this.idpUrl + '/oauth/token',
          {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
              username: this.configService.get<string>('IDP_CLIENT_ID'),
              password: this.configService.get<string>('IDP_CLIENT_SECRET'),
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );
    return tokenResponse.data;
  }

  async revoke(token: string): Promise<void> {
    await firstValueFrom(
      this.httpService
        .post(
          this.idpUrl + '/revoke',
          {
            token,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
              username: process.env.IDP_CLIENT_ID,
              password: process.env.IDP_CLIENT_SECRET,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
              throw new UnauthorizedException();
            }
            throw new InternalServerErrorException();
          }),
        ),
    );
  }
}
