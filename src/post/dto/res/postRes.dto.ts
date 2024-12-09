import { ItemCategory, PostStatus, PostType } from '@prisma/client';

export class AuthorDto {
  uuid: string;
  name: string;
}

export class BuildingDto {
  id: number;
  name: string;
  enName: string;
  gps: string;
  code: string;
}

export class PostResponseDto {
  id: number;

  type: PostType;

  title: string;

  description: string;

  images: string[];

  category: ItemCategory;

  status: PostStatus;

  author: AuthorDto;

  building: BuildingDto;

  locationDetail: string;

  createdAt: Date;

  updatedAt: Date;
}

export class PostListDto {
  total: number;
  list: PostResponseDto[];

  nextCursor?: number;
}
