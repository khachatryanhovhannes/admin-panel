import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePageDto, UpdatePageDto } from './dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPageDto: CreatePageDto) {
    return this.prisma.pages.create({
      data: createPageDto,
    });
  }

  async findAll() {
    return this.prisma.pages.findMany({
      include: {
        page_content: true,
      },
    });
  }

  async findOne(id: number) {
    const page = await this.prisma.pages.findUnique({
      where: { id },
      include: {
        page_content: true,
      },
    });

    if (!page) {
      throw new NotFoundException(`Page with ID ${id} not found`);
    }

    return page;
  }

  async update(id: number, updatePageDto: UpdatePageDto) {
    await this.findOne(id);

    return this.prisma.pages.update({
      where: { id },
      data: updatePageDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.pages_content.deleteMany({
      where: { pagesId: id },
    });

    return this.prisma.pages.delete({
      where: { id },
    });
  }
}
