import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/req/createPost.dto';

import { PostResponseDto } from './dto/res/postRes.dto';
import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/req/updatePost.dto';

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

  async findPostById(id: number): Promise<PostResponseDto | null> {
    const post = await this.prismaService.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });

    if (!post) return null;

    return {
      id: post.id,
      type: post.type,
      title: post.title,
      description: post.description,
      images: post.images,
      location: post.location as string, // 변환 추가
      category: post.category,
      status: post.status,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const updatedPost = await this.prismaService.post.update({
      where: { id: id },
      data: updatePostDto,
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
      id: updatedPost.id,
      type: updatedPost.type,
      title: updatedPost.title,
      description: updatedPost.description,
      images: updatedPost.images,
      location: updatedPost.location as string,
      category: updatedPost.category,
      status: updatedPost.status,
      author: updatedPost.author,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    };
  }

  async deletePost(id: number): Promise<void> {
    await this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }
}
