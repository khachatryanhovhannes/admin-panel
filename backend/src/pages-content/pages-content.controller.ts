import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PagesContentService } from './pages-content.service';
import { CreatePageContentDto, UpdatePageContentDto } from './dto';

@Controller('pages-content')
export class PagesContentController {
  constructor(private readonly pagesContentService: PagesContentService) {}

  @Post()
  create(@Body() createPageContentDto: CreatePageContentDto) {
    return this.pagesContentService.create(createPageContentDto);
  }

  @Get()
  findAll() {
    return this.pagesContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pagesContentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePageContentDto: UpdatePageContentDto,
  ) {
    return this.pagesContentService.update(id, updatePageContentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pagesContentService.remove(id);
  }
}
