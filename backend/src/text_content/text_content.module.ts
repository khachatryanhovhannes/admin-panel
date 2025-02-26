import { Module } from '@nestjs/common';
import { TextContentService } from './text_content.service';
import { TextContentController } from './text_content.controller';

@Module({
  providers: [TextContentService],
  controllers: [TextContentController]
})
export class TextContentModule {}
