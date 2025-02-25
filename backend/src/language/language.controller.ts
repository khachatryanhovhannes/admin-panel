import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LanguageService } from './language.service';
import { Language } from '@prisma/client';

@Controller('admin/languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  create(
    @Body()
    dto: {
      name_en: string;
      name_native: string;
      short_code: string;
      logo_url?: string;
    },
  ) {
    return this.languageService.create(dto);
  }

  @Get()
  findAll(): Promise<Language[]> {
    return this.languageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Language> {
    return this.languageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<Language>) {
    return this.languageService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Language> {
    return this.languageService.remove(+id);
  }
}
