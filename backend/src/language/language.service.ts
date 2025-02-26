import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLanguage, UpdateLanguage } from './dto';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLanguageDto: CreateLanguage) {
    return this.prisma.language.create({
      data: createLanguageDto,
    });
  }

  async findAll() {
    return this.prisma.language.findMany();
  }

  async findOne(id: number) {
    const language = await this.prisma.language.findUnique({
      where: { id },
    });

    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    return language;
  }

  async update(id: number, updateLanguageDto: UpdateLanguage) {
    const language = await this.findOne(id);

    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    return this.prisma.language.update({
      where: { id },
      data: updateLanguageDto,
    });
  }

  async remove(id: number) {
    const language = await this.findOne(id);

    if (!language) {
      throw new NotFoundException(`Language with ID ${id} not found`);
    }

    return this.prisma.language.delete({
      where: { id },
    });
  }
}
