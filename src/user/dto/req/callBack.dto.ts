import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginCallbackDto {
  @ApiProperty({
    type: String,
    description: 'authorization code',
    example: 'vjSUSKAI0I7VBb1u2BU1Q4PIwD5S4z51NbKSk8ObP',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
