import { ItemCategory, PostType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({ each: true })
  @IsOptional()
  images: string[] = [];

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(ItemCategory)
  @IsNotEmpty()
  category: ItemCategory;
}
