import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNavbar, UpdateNavbar } from './dto';
@Injectable()
export class NavbarService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNavbarDto: CreateNavbar) {
    return this.prisma.navbar.create({
      data: createNavbarDto,
    });
  }

  async findAll() {
    return this.prisma.navbar.findMany();
  }

  async findOne(id: number) {
    const navbar = await this.prisma.navbar.findUnique({
      where: { id },
    });

    if (!navbar) {
      throw new NotFoundException(`Navbar with ID ${id} not found`);
    }

    return navbar;
  }

  async update(id: number, updateNavbarDto: UpdateNavbar) {
    await this.findOne(id);

    return this.prisma.navbar.update({
      where: { id },
      data: updateNavbarDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.navbar_item.deleteMany({
      where: { navId: id },
    });

    return this.prisma.navbar.delete({
      where: { id },
    });
  }
}
