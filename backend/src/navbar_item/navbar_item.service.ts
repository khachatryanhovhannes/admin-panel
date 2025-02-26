import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNavbarItem, UpdateNavbarItem } from './dto';

@Injectable()
export class NavbarItemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNavbarItemDto: CreateNavbarItem) {
    return this.prisma.navbar_item.create({
      data: createNavbarItemDto,
    });
  }

  async findAll() {
    return this.prisma.navbar_item.findMany();
  }

  async findOne(id: number) {
    const navbarItem = await this.prisma.navbar_item.findUnique({
      where: { id },
    });

    if (!navbarItem) {
      throw new NotFoundException(`Navbar Item with ID ${id} not found`);
    }

    return navbarItem;
  }

  async update(id: number, updateNavbarItemDto: UpdateNavbarItem) {
    await this.findOne(id);

    return this.prisma.navbar_item.update({
      where: { id },
      data: updateNavbarItemDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.navbar_item.delete({
      where: { id },
    });
  }
}
