import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PostController } from './post.controller';
import { UserModule } from 'src/user/user.module';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PassportModule, ConfigModule, UserModule, PrismaModule],
  providers: [PostService, PostRepository],
  controllers: [PostController],
})
export class PostModule {}
