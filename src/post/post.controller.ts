import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { IdPGuard } from 'src/user/guard/idp.guard';
import { CreatePostDto } from './dto/req/createPost.dto';
import { PostService } from './post.service';
import { PostListDto, PostResponseDto } from './dto/res/postRes.dto';
import { UpdatePostDto } from './dto/req/updatePost.dto';
import { PostFilterDto } from './dto/req/postFilter.dto';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOperation({
    summary: 'get post list',
    description: 'get post list with filter query',
  })
  @ApiOkResponse({
    type: PostListDto,
    description: 'Return Post List',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @Get('list')
  async getPostList(
    @Query() postFilterDto: PostFilterDto,
  ): Promise<PostListDto> {
    return this.postService.getPostList(postFilterDto);
  }

  @ApiOperation({
    summary: 'get my post list',
    description: 'get all my post list with',
  })
  @ApiOkResponse({
    type: PostListDto,
    description: 'Return My Post List',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('access-token')
  @Get('my-posts')
  @UseGuards(IdPGuard)
  async getMyPosts(@GetUser() user: User): Promise<PostListDto> {
    return this.postService.getMyPostList(user.uuid);
  }

  @ApiOperation({
    summary: 'create post',
    description: 'create post with token',
  })
  @ApiOkResponse({
    type: PostListDto,
    description: 'Return Created Post',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('access-token')
  @Post()
  @UseGuards(IdPGuard)
  async createPost(
    @GetUser() user: User,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.createPost(createPostDto, user.uuid);
  }

  @ApiOperation({
    summary: 'get post',
    description: 'get post by id',
  })
  @ApiOkResponse({
    type: PostResponseDto,
    description: 'Return Single Post matched with id',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @Get(':id')
  async getPostByid(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostResponseDto> {
    return this.postService.getPostById(id);
  }

  @ApiOperation({
    summary: 'update post',
    description: 'update my post',
  })
  @ApiOkResponse({
    type: PostResponseDto,
    description: 'Return Single Post matched with id',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('access-token')
  @Patch(':id')
  @UseGuards(IdPGuard)
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.updatePost(id, updatePostDto, user.uuid);
  }

  @ApiOperation({
    summary: 'delete post',
    description: 'delete my post',
  })
  @ApiNoContentResponse({ description: 'No content returned' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('access-token')
  @Delete(':id')
  @UseGuards(IdPGuard)
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.postService.deletePost(id, user.uuid);
  }
}
