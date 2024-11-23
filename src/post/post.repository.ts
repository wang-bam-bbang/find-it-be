import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/req/createPost.dto';

import { PostResponseDto } from './dto/res/postRes.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
  constructor(private prismaService: PrismaService) {}

  async createPost(
    createPostDto: CreatePostDto,
    userUuid: string,
  ): Promise<PostResponseDto> {
    const { type, title, description, images, location, category } =
      createPostDto;

    const post = await this.prismaService.post.create({
      data: {
        author: {
          connect: {
            uuid: userUuid,
          },
        },
        type,
        title,
        description,
        images,
        location,
        category,
        status: 'IN_PROGRESS',
      },
      include: {
        author: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });

    return {
      id: post.id,
      type: post.type,
      title: post.title,
      description: post.description,
      images: post.images,
      location: post.location as string,
      category: post.category,
      status: post.status,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async findPostsByUser(userUuid: string): Promise<PostResponseDto[]> {
    const posts = await this.prismaService.post.findMany({
      where: { authorId: userUuid },
      include: {
        author: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      type: post.type,
      title: post.title,
      description: post.description,
      images: post.images,
      location: post.location as string,
      category: post.category,
      status: post.status,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }
}
