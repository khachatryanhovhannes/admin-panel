import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTextDto, UpdateTextDto } from './dto';

@Injectable()
export class TextService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTextDto: CreateTextDto) {
    return this.prisma.text.create({
      data: createTextDto,
    });
  }

  async findAll() {
    return this.prisma.text.findMany({
      include: {
        Text_content: true,
      },
    });
  }

  async findOne(id: number) {
    const text = await this.prisma.text.findUnique({
      where: { id },
      include: {
        Text_content: true,
      },
    });

    if (!text) {
      throw new NotFoundException(`Text with ID ${id} not found`);
    }

    return text;
  }

  async update(id: number, updateTextDto: UpdateTextDto) {
    // Ensure the text record exists
    await this.findOne(id);

    return this.prisma.text.update({
      where: { id },
      data: updateTextDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.text_content.deleteMany({
      where: { textId: id },
    });

    return this.prisma.text.delete({
      where: { id },
    });
  }
}
