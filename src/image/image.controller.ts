import {
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ImageService } from './image.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IdPGuard } from 'src/user/guard/idp.guard';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @ApiOperation({
    summary: 'upload images',
    description: 'upload images',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of images to upload',
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    type: [String],
    description: 'Return keys of uploaed images',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @ApiBearerAuth('access-token')
  @Post('upload')
  @UseGuards(IdPGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    return this.imageService.uploadImages(files);
  }
}
