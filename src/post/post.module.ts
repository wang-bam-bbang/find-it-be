import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PostController } from './post.controller';
import { UserModule } from 'src/user/user.module';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ImageModule } from 'src/image/image.module';
import { BuildingModule } from 'src/building/building.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UserModule,
    PrismaModule,
    ImageModule,
    BuildingModule,
  ],
  providers: [PostService, PostRepository],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
