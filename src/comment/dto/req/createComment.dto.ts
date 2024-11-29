import { CommentType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(CommentType)
  @IsNotEmpty()
  type: CommentType;

  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}
