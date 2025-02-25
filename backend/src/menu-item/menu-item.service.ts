import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MenuItem, Prisma } from '@prisma/client';

@Injectable()
export class MenuItemService {
  constructor(private prisma: PrismaService) {}

  // Ստեղծում ենք MenuItem + միաժամանակ translations (nested create)
  async create(data: Prisma.MenuItemCreateInput): Promise<MenuItem> {
    return this.prisma.menuItem.create({
      data,
      include: {
        translations: true,
      },
    });
  }

  async findAll(): Promise<MenuItem[]> {
    return this.prisma.menuItem.findMany({
      include: {
        translations: true,
        children: true,
        parent: true,
      },
    });
  }

  async findOne(id: number): Promise<MenuItem> {
    return this.prisma.menuItem.findUniqueOrThrow({
      where: { id },
      include: {
        translations: true,
        children: true,
        parent: true,
      },
    });
  }

  // Թարմացնել MenuItem + nested update translations
  async update(
    id: number,
    data: Prisma.MenuItemUpdateInput,
  ): Promise<MenuItem> {
    return this.prisma.menuItem.update({
      where: { id },
      data,
      include: {
        translations: true,
        children: true,
        parent: true,
      },
    });
  }

  async remove(id: number): Promise<MenuItem> {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
