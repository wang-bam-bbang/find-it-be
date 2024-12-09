import { ApiProperty } from '@nestjs/swagger';
import { ItemCategory, PostType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    enum: PostType,
    enumName: 'PostType',
    description: 'Type of post (FOUND or LOST)',
    example: PostType.FOUND,
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType;

  @ApiProperty({
    type: String,
    description: 'Title of post',
    example: 'This is a title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: String,
    description: 'Description of post',
    example: 'This is a description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: [String],
    description: 'Array of image keys/filenames for the post',
    example: ['thisisanimagekey.jpg'],
  })
  @IsString({ each: true })
  @IsOptional()
  images: string[] = [];

  @ApiProperty({
    type: Number,
    description: 'Building where the item was found or lost.',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  buildingId: number;

  @ApiProperty({
    type: String,
    description: 'Detailed location description.',
    example: '206호로 추정',
  })
  @IsString()
  @IsNotEmpty()
  locationDetail: string;

  @ApiProperty({
    enum: ItemCategory,
    enumName: 'ItemCategory',
    description: 'Item category',
    example: ItemCategory.ELECTRONICS,
  })
  @IsEnum(ItemCategory)
  @IsNotEmpty()
  category: ItemCategory;
}
