import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Language, Prisma } from '@prisma/client';

@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LanguageCreateInput): Promise<Language> {
    return this.prisma.language.create({ data });
  }

  async findAll(): Promise<Language[]> {
    return this.prisma.language.findMany();
  }

  async findOne(id: number): Promise<Language> {
    return this.prisma.language.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(
    id: number,
    data: Prisma.LanguageUpdateInput,
  ): Promise<Language> {
    return this.prisma.language.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Language> {
    return this.prisma.language.delete({
      where: { id },
    });
  }
}
