import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostRepository } from './post.repository';

import { CreatePostDto } from './dto/req/createPost.dto';
import { PostResponseDto } from './dto/res/postRes.dto';

@Injectable()
export class PostService {
  constructor(
    private configService: ConfigService,
    private postRepository: PostRepository,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    userUuid: string,
  ): Promise<PostResponseDto> {
    // TODO: image url valication process need to be added.
    // S3 key가 올바른지

    // : Promise<Post & { author: Pick<User, 'name' | 'uuid'> }>
    const newPost = this.postRepository.createPost(createPostDto, userUuid);

    // TODO: FCM process need to be added.

    return newPost;
  }
}
