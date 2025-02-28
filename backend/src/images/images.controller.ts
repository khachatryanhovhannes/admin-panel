import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAll() {
    return this.imagesService.getAllImages();
  }

  @Get(':key')
  async getOne(@Param('key') key: string) {
    return this.imagesService.getImageByKey(key);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const ext = path.extname(file.originalname);
          const fileName = `${Date.now()}${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('key') key: string,
  ) {
    return this.imagesService.uploadImage(file, key);
  }

  @Put(':key')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const ext = path.extname(file.originalname);
          const fileName = `${Date.now()}${ext}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('key') key: string,
  ) {
    return this.imagesService.updateImage(file, key);
  }

  @Delete(':key')
  async delete(@Param('key') key: string) {
    return this.imagesService.deleteImage(key);
  }
}
