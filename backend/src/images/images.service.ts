import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Images } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllImages(): Promise<Images[]> {
    return this.prisma.images.findMany();
  }

  async getImageByKey(key: string): Promise<Images | null> {
    return this.prisma.images.findUnique({
      where: { key },
    });
  }

  async uploadImage(file: Express.Multer.File, key: string): Promise<Images> {
    const imageUrl = `/uploads/${file.filename}`;

    return this.prisma.images.create({
      data: {
        key,
        imageUrl,
      },
    });
  }

  async updateImage(file: Express.Multer.File, key: string): Promise<Images> {
    const existingImage = await this.prisma.images.findUnique({
      where: { key },
    });

    if (!existingImage) {
      throw new Error('Image not found');
    }

    const oldFilePath = path.join(
      __dirname,
      '../../uploads/',
      path.basename(existingImage.imageUrl),
    );

    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }

    const newImageUrl = `/uploads/${file.filename}`;

    return this.prisma.images.update({
      where: { key },
      data: {
        imageUrl: newImageUrl,
      },
    });
  }

  async deleteImage(key: string): Promise<Images> {
    const image = await this.prisma.images.findUnique({
      where: { key },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    const filePath = path.join(
      __dirname,
      '../../uploads/',
      path.basename(image.imageUrl),
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return this.prisma.images.delete({
      where: { key },
    });
  }
}
