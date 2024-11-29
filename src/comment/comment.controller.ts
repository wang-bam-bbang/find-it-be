import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { IdPGuard } from 'src/user/guard/idp.guard';
import { CreateCommentDto } from './dto/req/createComment.dto';
import { CommentResponseDto } from './dto/res/commentRes.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  @UseGuards(IdPGuard)
  async createComment(
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.createComment(user.uuid, createCommentDto);
  }

  @Get(':postId')
  async getPostComments(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.getPostComments(postId);
  }
}
