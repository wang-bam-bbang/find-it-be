import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { IdPGuard } from 'src/user/guard/idp.guard';
import { CreatePostDto } from './dto/req/createPost.dto';
import { PostService } from './post.service';
import { PostListDto, PostResponseDto } from './dto/res/postRes.dto';
import { UpdatePostDto } from './dto/req/updatePost.dto';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @UseGuards(IdPGuard)
  async createPost(
    @GetUser() user: User,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.createPost(createPostDto, user.uuid);
  }

  @Patch(':id')
  @UseGuards(IdPGuard)
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, updatePostDto, user.uuid);
  }

  @Get('my-posts')
  @UseGuards(IdPGuard)
  async getMyPosts(@GetUser() user: User): Promise<PostListDto> {
    return this.postService.getMyPosts(user.uuid);
  }
}
