import { CommentType } from '@prisma/client';

export class AuthorDto {
  uuid: string;
  name: string;
}

export class CommentResponseDto {
  id: number;
  content: string;
  type: CommentType;

  postId: number;
  author: AuthorDto;
  parentId?: number;

  createdAt: Date;
  isDeleted: boolean;

  children?: CommentResponseDto[];
}
