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
    required: false,
  })
  @IsEnum(ItemCategory)
  @IsOptional()
  category?: ItemCategory;

  @ApiProperty({
    enum: PostType,
    enumName: 'PostType',
    description: 'Type of post (FOUND or LOST)',
    example: PostType.FOUND,
    required: false,
  })
  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;

  @ApiProperty({
    enum: PostStatus,
    enumName: 'PostStatus',
    description: 'Post status',
    example: PostStatus.IN_PROGRESS,
    required: false,
  })
  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @ApiProperty({
    type: Number,
    description: 'Building Id',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsInt()
  @IsOptional()
  buildingId?: number;

  @ApiProperty({
    type: Number,
    description: 'Pagination cursor for next set of results',
    example: 0,
    required: false,
  })
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsInt()
  @IsOptional()
  cursor?: number;

  @ApiProperty({
    type: Number,
    description: 'Number of posts to return (maximum 100)',
    example: 20,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Max(100)
  take?: number;
}
