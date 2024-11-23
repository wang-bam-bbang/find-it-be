import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { IdPGuard } from 'src/user/guard/idp.guard';
import { CreatePostDto } from './dto/req/createPost.dto';
import { PostService } from './post.service';
import { PostResponseDto } from './dto/res/postRes.dto';

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
}
