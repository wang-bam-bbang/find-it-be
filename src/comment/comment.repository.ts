import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentResponseDto } from './dto/res/commentRes.dto';
import { CreateCommentDto } from './dto/req/createComment.dto';

@Injectable()
export class CommentRepository {
  constructor(private prismaService: PrismaService) {}

  async getCommentById(id): Promise<CommentResponseDto> {
    return this.prismaService.comment.findUnique({
      where: {
        id,
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
  }

  async createComment(
    userUuid: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const { content, type, postId, parentId } = createCommentDto;

    const comment = await this.prismaService.comment.create({
      data: {
        author: {
          connect: {
            uuid: userUuid,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
        ...(parentId && {
          parent: {
            connect: {
              id: parentId,
            },
          },
        }),
        content,
        type,
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
      id: comment.id,
      content: comment.content,
      type: comment.type,
      postId: comment.postId,
      author: comment.author,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      isDeleted: comment.isDeleted,
    };
  }

  async getPostComments(postId: number): Promise<CommentResponseDto[]> {
    const comments = await this.prismaService.comment.findMany({
      where: {
        postId,
        type: 'COMMENT',
      },
      include: {
        author: {
          select: {
            uuid: true,
            name: true,
          },
        },
        children: {
          include: {
            author: {
              select: {
                uuid: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      type: comment.type,

      postId: comment.postId,
      author: comment.author,

      createdAt: comment.createdAt,
      isDeleted: comment.isDeleted,

      children: comment.children.map((child) => ({
        id: child.id,
        content: child.content,
        type: child.type,

        postId: child.postId,
        author: child.author,
        parentId: child.parentId,

        createdAt: child.createdAt,
        isDeleted: child.isDeleted,
      })),
    }));
  }
}
