import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/req/createComment.dto';
import { CommentResponseDto } from './dto/res/commentRes.dto';
import { PostService } from 'src/post/post.service';
import { CommentRepository } from './comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private postService: PostService,
    private commentRepository: CommentRepository,
  ) {}

  async createComment(
    userUuid: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const { postId, parentId } = createCommentDto;

    const post = await this.postService.getPostById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (parentId) {
      const parentComment =
        await this.commentRepository.getCommentById(parentId);
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

  async deleteComment(userUuid: string, commentId: number): Promise<void> {
    const comment = await this.commentRepository.getCommentById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.author.uuid !== userUuid) {
      throw new ForbiddenException(
        "Don't have permission to delete the comment",
      );
    }

    await this.commentRepository.deleteComment(commentId);
  }
}
