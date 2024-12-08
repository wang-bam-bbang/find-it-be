import { ItemCategory, PostStatus, PostType } from '@prisma/client';

export class AuthorDto {
  uuid: string;
  name: string;
}

export class PostResponseDto {
  id: number;

  type: PostType;

  title: string;

  description: string;

  images: string[];

  // location: string;

  category: ItemCategory;

  status: PostStatus;

  author: AuthorDto;

  createdAt: Date;

  updatedAt: Date;
}

export class PostListDto {
  total: number;
  list: PostResponseDto[];

  nextCursor?: number;
}
