import { ApiProperty } from '@nestjs/swagger';
import { ItemCategory, PostStatus, PostType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max } from 'class-validator';

export class PostFilterDto {
  @ApiProperty({
    enum: ItemCategory,
    enumName: 'ItemCategory',
    description: 'Item category',
    example: ItemCategory.ELECTRONICS,
  })
  @IsEnum(ItemCategory)
  @IsOptional()
  category?: ItemCategory;

  @ApiProperty({
    enum: PostType,
    enumName: 'PostType',
    description: 'Type of post (FOUND or LOST)',
    example: PostType.FOUND,
  })
  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;

  @ApiProperty({
    enum: PostStatus,
    enumName: 'PostStatus',
    description: 'Post status',
    example: PostStatus.IN_PROGRESS,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiProperty({
    type: Number,
    description: 'Pagination cursor for next set of results',
    example: 0,
  })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsInt()
  @IsOptional()
  cursor?: number;

  @ApiProperty({
    type: Number,
    description: 'Number of posts to return (maximum 20)',
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Max(20)
  take?: number;
}
