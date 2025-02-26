import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConstantDto, UpdateConstantDto } from './dto';

@Injectable()
export class ConstantService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConstantDto: CreateConstantDto) {
    return this.prisma.constants.create({
      data: createConstantDto,
    });
  }

  async findAll() {
    return this.prisma.constants.findMany();
  }

  async findOne(id: number) {
    const constant = await this.prisma.constants.findUnique({
      where: { id },
    });

    if (!constant) {
      throw new NotFoundException(`Constant with ID ${id} not found`);
    }

    return constant;
  }

  async update(id: number, updateConstantDto: UpdateConstantDto) {
    await this.findOne(id);

    return this.prisma.constants.update({
      where: { id },
      data: updateConstantDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.constants.delete({
      where: { id },
    });
  }
}
