import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PageService } from './page.service';
import { Page } from '@prisma/client';

@Controller('admin/pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  create(@Body() data: any) {
    // data-ը պետք է համապատասխանեցնեք ձեր DTO-ին:
    return this.pageService.create(data);
  }

  @Get()
  findAll(): Promise<Page[]> {
    return this.pageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Page> {
    return this.pageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.pageService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pageService.remove(+id);
  }
}
