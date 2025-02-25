import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GlobalContentService } from './global-content.service';
import { GlobalContent } from '@prisma/client';

@Controller('admin/global-contents')
export class GlobalContentController {
  constructor(private readonly globalContentService: GlobalContentService) {}

  @Post()
  create(@Body() data: any): Promise<GlobalContent> {
    return this.globalContentService.create(data);
  }

  @Get()
  findAll(): Promise<GlobalContent[]> {
    return this.globalContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GlobalContent> {
    return this.globalContentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.globalContentService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.globalContentService.remove(+id);
  }
}
