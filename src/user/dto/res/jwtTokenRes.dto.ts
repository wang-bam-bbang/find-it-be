import { IsNotEmpty, IsString } from 'class-validator';

export class JwtTokenResDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}
