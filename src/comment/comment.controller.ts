import {
  Body,
  Controller,
  Delete,
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
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @ApiOperation({
    summary: 'create comment',
    description: 'create comment on specific post',
  })
  @ApiOkResponse({
    type: CommentResponseDto,
    description: 'Return Created Comment',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(IdPGuard)
  async createComment(
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.commentService.createComment(user.uuid, createCommentDto);
  }

  @ApiOperation({
    summary: 'get comments',
    description: 'get all comments of specific post',
  })
  @ApiOkResponse({
    type: [CommentResponseDto],
    description: 'Return all comments of specific post',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @Get(':postId')
  async getPostComments(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.getPostComments(postId);
  }

  @ApiOperation({
    summary: 'delete comment',
    description: 'delete comment',
  })
  @ApiNoContentResponse({
    description: 'No content returned',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('access-token')
  @Delete(':commentId')
  @UseGuards(IdPGuard)
  async deleteComment(
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<void> {
    this.commentService.deleteComment(user.uuid, commentId);
  }
}
