import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Menu, Prisma } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MenuCreateInput): Promise<Menu> {
    return this.prisma.menu.create({ data });
  }

  async findAll(): Promise<Menu[]> {
    return this.prisma.menu.findMany({
      include: {
        items: true, // եթե պիտի նաև բերի MenuItem-ները
      },
    });
  }

  async findOne(id: number): Promise<Menu> {
    return this.prisma.menu.findUniqueOrThrow({
      where: { id },
      include: {
        items: true,
      },
    });
  }

  async update(id: number, data: Prisma.MenuUpdateInput): Promise<Menu> {
    return this.prisma.menu.update({
      where: { id },
      data,
      include: {
        items: true,
      },
    });
  }

  async remove(id: number): Promise<Menu> {
    return this.prisma.menu.delete({
      where: { id },
    });
  }
}
