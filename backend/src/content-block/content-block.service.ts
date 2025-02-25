import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentBlock, Prisma } from '@prisma/client';

@Injectable()
export class ContentBlockService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ContentBlockCreateInput): Promise<ContentBlock> {
    return this.prisma.contentBlock.create({
      data,
      include: {
        translations: true,
      },
    });
  }

  async findAll(): Promise<ContentBlock[]> {
    return this.prisma.contentBlock.findMany({
      include: {
        translations: true,
      },
    });
  }

  async findOne(id: number): Promise<ContentBlock> {
    return this.prisma.contentBlock.findUniqueOrThrow({
      where: { id },
      include: {
        translations: true,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.ContentBlockUpdateInput,
  ): Promise<ContentBlock> {
    return this.prisma.contentBlock.update({
      where: { id },
      data,
      include: {
        translations: true,
      },
    });
  }

  async remove(id: number): Promise<ContentBlock> {
    return this.prisma.contentBlock.delete({
      where: { id },
    });
  }
}
