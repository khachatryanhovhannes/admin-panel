import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TextContentService } from './text_content.service';
import { CreateTextContentDto } from './dto/create-text-content.dto';
import { UpdateTextContentDto } from './dto/update-text-content.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('text-content')
export class TextContentController {
  constructor(private readonly textContentService: TextContentService) {}

  @Post()
  create(@Body() createTextContentDto: CreateTextContentDto) {
    return this.textContentService.create(createTextContentDto);
  }

  @Get()
  findAll() {
    return this.textContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.textContentService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTextContentDto: UpdateTextContentDto,
  ) {
    return this.textContentService.update(Number(id), updateTextContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textContentService.remove(Number(id));
  }
}
