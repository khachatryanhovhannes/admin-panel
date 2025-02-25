import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Page, Prisma } from '@prisma/client';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}

  // Ստեղծել Page + միաժամանակ translations (nested create)
  async create(data: Prisma.PageCreateInput): Promise<Page> {
    return this.prisma.page.create({
      data,
      include: {
        translations: true, // վերադառնում ենք նաև translations
      },
    });
  }

  async findAll(): Promise<Page[]> {
    return this.prisma.page.findMany({
      include: {
        translations: true,
      },
    });
  }

  async findOne(id: number): Promise<Page> {
    return this.prisma.page.findUniqueOrThrow({
      where: { id },
      include: {
        translations: true,
      },
    });
  }

  // Թարմացնել Page + միաժամանակ translations (nested update)
  async update(id: number, data: Prisma.PageUpdateInput): Promise<Page> {
    return this.prisma.page.update({
      where: { id },
      data,
      include: {
        translations: true,
      },
    });
  }

  async remove(id: number): Promise<Page> {
    return this.prisma.page.delete({
      where: { id },
    });
  }
}
