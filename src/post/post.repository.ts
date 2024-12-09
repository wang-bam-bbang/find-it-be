import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/req/createPost.dto';

import { PostResponseDto } from './dto/res/postRes.dto';
import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/req/updatePost.dto';
import { PostFilterDto } from './dto/req/postFilter.dto';
import { PostType } from '@prisma/client';

@Injectable()
export class PostRepository {
  constructor(private prismaService: PrismaService) {}

  async findPostList(postFilterDto: PostFilterDto): Promise<PostResponseDto[]> {
    const {
      category,
      type,
      status,
      buildingId,
      cursor,
      take = 10,
    } = postFilterDto;

    const where = {
      ...(category && { category }),
      ...(type && { type }),
      ...(status && { status }),
      ...(buildingId && { buildingId }),
    };

    const postList = await this.prismaService.post.findMany({
      where,
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        author: {
          select: {
            uuid: true,
            name: true,
          },
        },
        building: {
          select: {
            id: true,
            name: true,
            enName: true,
            gps: true,
            code: true,
          },
        },
      },
    });

    return postList.map((post) => ({
      id: post.id,
      type: post.type,
      title: post.title,
      description: post.description,
      images: post.images,

      building: post.building,
      locationDetail: post.locationDetail,

      category: post.category,
      status: post.status,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }

  async createPost(
    createPostDto: CreatePostDto,
    userUuid: string,
  ): Promise<PostResponseDto> {
    // const { type, title, description, images, location, category } =
    //   createPostDto;

    const {
      type,
      title,
      description,
      images,
      category,
      buildingId,
      locationDetail,
    } = createPostDto;

    const post = await this.prismaService.post.create({
      data: {
        author: {
          connect: {
            uuid: userUuid,
          },
        },
        building: {
          connect: {
            id: buildingId,
          },
        },
        type,
        title,
        description,
        images,
        locationDetail,
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
        building: {
          select: {
            id: true,
            name: true,
            enName: true,
            gps: true,
            code: true,
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

      building: post.building,
      locationDetail: post.locationDetail,

      category: post.category,
      status: post.status,
      author: post.author,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async findPostsByUser(
    userUuid: string,
    type?: PostType,
  ): Promise<PostResponseDto[]> {
    const posts = await this.prismaService.post.findMany({
      where: { authorId: userUuid, type },
      include: {
        author: {
          select: {
            uuid: true,
            name: true,
          },
        },
        building: {
          select: {
            id: true,
            name: true,
            enName: true,
            gps: true,
            code: true,
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

      building: post.building,
      locationDetail: post.locationDetail,

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
        building: {
          select: {
            id: true,
            name: true,
            enName: true,
            gps: true,
            code: true,
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

      building: post.building,
      locationDetail: post.locationDetail,

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
        building: {
          select: {
            id: true,
            name: true,
            enName: true,
            gps: true,
            code: true,
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

      building: updatedPost.building,
      locationDetail: updatedPost.locationDetail,

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
