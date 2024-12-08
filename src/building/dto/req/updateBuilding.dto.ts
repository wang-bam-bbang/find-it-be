import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBuildingDto {
  @ApiProperty({
    type: String,
    description: 'Building Name',
    example: '대학 A동',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    type: String,
    description: 'Building Name in enlglish',
    example: 'College A',
    required: false,
  })
  @IsString()
  @IsOptional()
  enName?: string;

  @ApiProperty({
    type: String,
    description: 'GPS info (lat, lon)',
    example: '(35.229695, 126.844536)',
    required: false,
  })
  @IsString()
  @IsOptional()
  gps: string;

  @ApiProperty({
    type: String,
    description: 'Building Code',
    example: 'N4',
    required: false,
  })
  @IsString()
  @IsOptional()
  code: string;
}
