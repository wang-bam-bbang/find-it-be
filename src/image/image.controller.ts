import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

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
}
