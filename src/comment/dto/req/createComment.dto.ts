import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommentType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    type: String,
    description: 'Content of comment',
    example: 'this is a comment for post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    enum: CommentType,
    enumName: 'CommentType',
    description: 'Comment Type',
    example: 'COMMENT',
  })
  @IsEnum(CommentType)
  @IsNotEmpty()
  type: CommentType;

  @ApiProperty({
    type: Number,
    description: 'Post id to add comment',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'Parent comment id',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}
