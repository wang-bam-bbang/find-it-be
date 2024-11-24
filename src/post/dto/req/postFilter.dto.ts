import { ItemCategory, PostStatus, PostType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class PostFilterDto {
  @IsEnum(ItemCategory)
  @IsOptional()
  category?: ItemCategory;

  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;

  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;

  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsInt()
  @IsOptional()
  cursor?: number;

  @IsInt()
  @IsOptional()
  take?: number;
}
