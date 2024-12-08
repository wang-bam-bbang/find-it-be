import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBuildingDto {
  @ApiProperty({
    type: String,
    description: 'Building Name',
    example: '대학 A동',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Building Name in english',
    example: 'College A',
  })
  @IsString()
  @IsNotEmpty()
  enName: string;

  @ApiProperty({
    type: String,
    description: 'GPS info (lat, lon)',
    example: '(35.229695, 126.844536)',
  })
  @IsString()
  @IsNotEmpty()
  gps: string;

  @ApiProperty({
    type: String,
    description: 'Building Code',
    example: 'N4',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
