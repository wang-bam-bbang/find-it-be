import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostRepository } from './post.repository';

import { CreatePostDto } from './dto/req/createPost.dto';
import { PostListDto, PostResponseDto } from './dto/res/postRes.dto';
import { UpdatePostDto } from './dto/req/updatePost.dto';
import { PostFilterDto } from './dto/req/postFilter.dto';

@Injectable()
export class PostService {
  constructor(
    private configService: ConfigService,
    private postRepository: PostRepository,
  ) {}

  async getPostList(postFilterDto: PostFilterDto): Promise<PostListDto> {
    const postList = await this.postRepository.findPostList(postFilterDto);

    const nextCursor =
      postList.length > 0 ? postList[postList.length - 1].id : null;

    return {
      total: postList.length,
      list: postList,
      nextCursor,
    };
  }

  async getMyPostList(userUuid: string): Promise<PostListDto> {
    const posts = await this.postRepository.findPostsByUser(userUuid);

    if (!posts.length) {
      throw new NotFoundException('No posts found for this user');
    }

    return {
      total: posts.length,
      list: posts,
    };
  }

  async getPostById(id: number): Promise<PostResponseDto> {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    userUuid: string,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.author.uuid != userUuid) {
      throw new ForbiddenException("Don't have permission to update the post");
    }
    return this.postRepository.updatePost(id, updatePostDto);
  }

  async deletePost(id: number, userUuid: string): Promise<void> {
    const post = await this.postRepository.findPostById(id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.author.uuid != userUuid) {
      throw new ForbiddenException("Don't have permission to update the post");
    }

    return this.postRepository.deletePost(id);
  }

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
