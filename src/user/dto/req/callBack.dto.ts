import { IsNotEmpty, IsString } from 'class-validator';

export class LoginCallbackDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
