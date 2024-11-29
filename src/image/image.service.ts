import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectTaggingCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  /**
   * 이미지 파일을 여러 개 업로드
   * @param files Express.Multer.File[]
   * @returns string[]
   */
  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadImage(file)));
  }

  /**
   * S3에 단일 이미지 업로드
   * @param file Express.Multer.File
   * @returns string
   */
  private async uploadImage(file: Express.Multer.File): Promise<string> {
    console.log(file);

    const key = `${Date.now()}-${Math.random().toString(36).substring(2)}${file.originalname}`;
    console.log(key);

    const webpFile = await this.convertToWebp(file);

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: webpFile.buffer,
      Tagging: 'expiration=true',
      Metadata: {
        originalName: encodeURIComponent(file.originalname),
      },
    });

    try {
      await this.s3Client.send(command);
      return key;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * S3에서 단일 이미지 삭제
   * @param key string
   */
  private async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to delete fiel');
    }
  }

  /**
   * 이미지를 WebP 형식으로 변환
   * @param file Express.Multer.File
   * @returns Express.Multer.File
   */
  private async convertToWebp(
    file: Express.Multer.File,
  ): Promise<Express.Multer.File> {
    try {
      file.buffer = await sharp(file.buffer)
        .rotate()
        .webp({ effort: 5 })
        .toBuffer();

      return file;
    } catch (error) {
      console.log(error);

      if (error.message.includes('unsupported image format')) {
        throw new BadRequestException('Unsupported image format');
      }
      throw new InternalServerErrorException('Failed to convert image to WebP');
    }
  }

  /**
   * s3에 있는 multiple images를 validate
   * @param key string[]
   */
  async validateImages(key: string[]): Promise<void> {
    await Promise.all(key.map((k) => this.validateImage(k)));
  }

  /**
   * s3에 있는 single image를 validate
   * 만약 존재하는 이미지라면 expiration tag를 false로 변경
   * @param key string
   * @returns void
   */
  private async validateImage(key: string): Promise<void> {
    const command = new PutObjectTaggingCommand({
      Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
      Key: key,
      Tagging: {
        TagSet: [{ Key: 'expiration', Value: 'false' }],
      },
    });
    await this.s3Client.send(command).catch((error) => {
      throw new InternalServerErrorException(error);
    });
  }
}
