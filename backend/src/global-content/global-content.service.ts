import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GlobalContent, Prisma } from '@prisma/client';

@Injectable()
export class GlobalContentService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.GlobalContentCreateInput): Promise<GlobalContent> {
    return this.prisma.globalContent.create({
      data,
      include: {
        translations: true,
      },
    });
  }

  async findAll(): Promise<GlobalContent[]> {
    return this.prisma.globalContent.findMany({
      include: {
        translations: true,
      },
    });
  }

  async findOne(id: number): Promise<GlobalContent> {
    return this.prisma.globalContent.findUniqueOrThrow({
      where: { id },
      include: {
        translations: true,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.GlobalContentUpdateInput,
  ): Promise<GlobalContent> {
    return this.prisma.globalContent.update({
      where: { id },
      data,
      include: {
        translations: true,
      },
    });
  }

  async remove(id: number): Promise<GlobalContent> {
    return this.prisma.globalContent.delete({
      where: { id },
    });
  }
}
