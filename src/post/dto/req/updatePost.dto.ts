import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    type: String,
    description: 'Title of post',
    example: 'This is a title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    type: String,
    description: 'Description of post',
    example: 'This is a description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: PostStatus,
    enumName: 'PostStatus',
    description: 'Status of post',
    example: 'RESOLVED',
    required: false,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}
