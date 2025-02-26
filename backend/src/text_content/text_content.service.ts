import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTextContentDto, UpdateTextContentDto } from './dto';

@Injectable()
export class TextContentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTextContentDto: CreateTextContentDto) {
    return this.prisma.text_content.create({
      data: createTextContentDto,
    });
  }

  async findAll() {
    return this.prisma.text_content.findMany({
      include: {
        text: true,
        language: true,
      },
    });
  }

  async findOne(id: number) {
    const textContent = await this.prisma.text_content.findUnique({
      where: { id },
      include: {
        text: true,
        language: true,
      },
    });

    if (!textContent) {
      throw new NotFoundException(`TextContent with ID ${id} not found`);
    }

    return textContent;
  }

  async update(id: number, updateTextContentDto: UpdateTextContentDto) {
    // Ensure the text content record exists
    await this.findOne(id);

    return this.prisma.text_content.update({
      where: { id },
      data: updateTextContentDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.text_content.delete({
      where: { id },
    });
  }
}
