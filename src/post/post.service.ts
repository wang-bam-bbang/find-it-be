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
import { ImageService } from 'src/image/image.service';
import { MyPostFilterDto } from './dto/req/myPostFilter.dto';

@Injectable()
export class PostService {
  private readonly s3Url: string;

  constructor(
    private configService: ConfigService,
    private postRepository: PostRepository,
    private imageService: ImageService,
  ) {
    // S3 URL 기본 경로 설정
    this.s3Url = `https://${this.configService.get<string>(
      'AWS_S3_BUCKET_NAME',
    )}.s3.${this.configService.get<string>('AWS_S3_REGION')}.amazonaws.com`;
  }

  async getPostList(postFilterDto: PostFilterDto): Promise<PostListDto> {
    const postList = await this.postRepository.findPostList(postFilterDto);

    const formattedPosts = await Promise.all(
      postList.map(async (post) => {
        const signedUrls = await this.imageService.generateSignedUrls(
          post.images,
        );
        return {
          ...post,
          images: signedUrls, // Signed URL 반환
        };
      }),
    );

    const nextCursor =
      postList.length > 0 ? postList[postList.length - 1].id : null;

    return {
      total: postList.length,
      list: formattedPosts,
      nextCursor,
    };
  }

  async getMyPostList(
    userUuid: string,
    myPostFilterDto: MyPostFilterDto,
  ): Promise<PostListDto> {
    const { type } = myPostFilterDto;

    const postList = await this.postRepository.findPostsByUser(userUuid, type);

    const formattedPosts = await Promise.all(
      postList.map(async (post) => {
        const signedUrls = await this.imageService.generateSignedUrls(
          post.images,
        );
        return {
          ...post,
          images: signedUrls, // Signed URL 반환
        };
      }),
    );

    return {
      total: postList.length,
      list: formattedPosts,
    };
  }

  async getPostById(id: number): Promise<PostResponseDto> {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const signedUrls = await this.imageService.generateSignedUrls(post.images);

    return {
      ...post,
      images: signedUrls,
    };
  }

  async createPost(
    createPostDto: CreatePostDto,
    userUuid: string,
  ): Promise<PostResponseDto> {
    if (createPostDto.images.length) {
      await this.imageService.validateImages(createPostDto.images);
    }

    const newPost = await this.postRepository.createPost(
      createPostDto,
      userUuid,
    );

    const signedUrls = await this.imageService.generateSignedUrls(
      newPost.images,
    );

    // TODO: FCM process need to be added.

    return {
      ...newPost,
      images: signedUrls,
    };
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
    const updatedPost = await this.postRepository.updatePost(id, updatePostDto);

    const signedUrls = await this.imageService.generateSignedUrls(
      updatedPost.images,
    );

    return {
      ...updatedPost,
      images: signedUrls,
    };
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
}
