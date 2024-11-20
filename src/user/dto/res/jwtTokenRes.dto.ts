import { IsEmpty, IsString } from 'class-validator';

export class JwtTokenResDto {
  @IsString()
  @IsEmpty()
  access_token: string;
}
