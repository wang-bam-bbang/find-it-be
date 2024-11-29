import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    return this.imageService.uploadImages(files);
  }

  @Post('test')
  async testImageUpload() {
    const s3 = new S3Client({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const bucketName = 'slp-findit';
    const fileKey = 'example-file12312.txt';
    const fileContent = Buffer.from('Hello, world!');

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: fileContent,
      });
      const response = await s3.send(command);
      console.log('File uploaded successfully:', response);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    console.log(`File uploaded to ${bucketName}/${fileKey}`);
  }
}
