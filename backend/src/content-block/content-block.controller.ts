import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ContentBlockService } from './content-block.service';
import { ContentBlock } from '@prisma/client';

@Controller('admin/content-blocks')
export class ContentBlockController {
  constructor(private readonly contentBlockService: ContentBlockService) {}

  @Post()
  create(@Body() data: any): Promise<ContentBlock> {
    // data օրինակ:
    // {
    //   key: 'headerBanner',
    //   isGlobal: true,
    //   translations: {
    //     create: [
    //       { content: "Banner text in English", language: { connect: { id: 1 } } },
    //       { content: "Banner տեքստ հայերեն", language: { connect: { id: 2 } } },
    //     ]
    //   }
    // }
    return this.contentBlockService.create(data);
  }

  @Get()
  findAll() {
    return this.contentBlockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentBlockService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.contentBlockService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentBlockService.remove(+id);
  }
}
