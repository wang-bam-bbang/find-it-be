import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ConfigModule } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [ImageService, S3Client],
  controllers: [ImageController],
  exports: [ImageService],
})
export class ImageModule {}
