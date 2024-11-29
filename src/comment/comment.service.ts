import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCommentDto } from './dto/req/createComment.dto';
import { CommentResponseDto } from './dto/res/commentRes.dto';
import { PostService } from 'src/post/post.service';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private configSerivce: ConfigService,
    private postService: PostService,
    private commentRepository: CommentRepository,
  ) {}

  async createComment(
    userUuid: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const { postId, parentId } = createCommentDto;

    const post = this.postService.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (parentId) {
      const parentComment = this.commentRepository.getCommentById(parentId);
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    return this.commentRepository.createComment(userUuid, createCommentDto);
  }

  async getCommentById(id: number): Promise<CommentResponseDto> {
    return this.commentRepository.getCommentById(id);
  }

  async getPostComments(postId: number): Promise<CommentResponseDto[]> {
    return this.commentRepository.getPostComments(postId);
  }
}
