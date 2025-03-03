import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageContentDto, UpdatePageContentDto } from './dto';

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as cheerio from 'cheerio';

@Injectable()
export class PagesContentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPageContentDto: CreatePageContentDto) {
    const processedContent = await this.processContentImages(
      createPageContentDto.content || '',
    );
    return this.prisma.pages_content.create({
      data: {
        ...createPageContentDto,
        content: processedContent,
      },
    });
  }

  async findAll() {
    return this.prisma.pages_content.findMany({
      include: {
        pages: true,
        language: true,
      },
    });
  }

  async findOne(id: number) {
    const pageContent = await this.prisma.pages_content.findUnique({
      where: { id },
      include: {
        pages: true,
        language: true,
      },
    });

    if (!pageContent) {
      throw new NotFoundException(`PageContent with ID ${id} not found`);
    }

    return pageContent;
  }

  async update(id: number, updatePageContentDto: UpdatePageContentDto) {
    await this.findOne(id);

    const processedContent = await this.processContentImages(
      updatePageContentDto.content || '',
    );
    return this.prisma.pages_content.update({
      where: { id },
      data: {
        ...updatePageContentDto,
        content: processedContent,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.pages_content.delete({
      where: { id },
    });
  }

  private async processContentImages(content: string): Promise<string> {
    if (!content) {
      return content;
    }

    const $ = cheerio.load(content);

    const uploadDir = path.join(__dirname, '..', '..', 'uploads', 'images');
    try {
      await fs.promises.mkdir(uploadDir, { recursive: true });
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to create upload directory',
      );
    }

    const imageProcessPromises: Promise<void>[] = [];

    $('img').each((_, element) => {
      const $element = $(element);
      const src = $element.attr('src');

      if (src && src.startsWith('data:image/')) {
        const splitted = src.split(';base64,');
        if (splitted.length < 2) {
          return;
        }
        const base64Data = splitted[1];
        const mime = src.substring(5, src.indexOf(';'));
        let extension = '.png';
        if (mime === 'image/jpeg') {
          extension = '.jpg';
        } else if (mime === 'image/gif') {
          extension = '.gif';
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${uuidv4()}${extension}`;
        const filePath = path.join(uploadDir, filename);

        const writeFilePromise = fs.promises
          .writeFile(filePath, buffer)
          .then(() => {
            $element.attr(
              'src',
              `http://localhost:3000/uploads/images/${filename}`,
            );
          })
          .catch(() => {
            throw new InternalServerErrorException(
              'Unable to write image file',
            );
          });
        imageProcessPromises.push(writeFilePromise);
      }
    });

    await Promise.all(imageProcessPromises);
    return $.html();
  }
}
