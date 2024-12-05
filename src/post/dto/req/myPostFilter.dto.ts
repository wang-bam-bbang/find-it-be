import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class MyPostFilterDto {
  @ApiProperty({
    enum: PostType,
    enumName: 'PostType',
    description: 'Type of post (FOUND or LOST)',
    example: PostType.FOUND,
  })
  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;
}
