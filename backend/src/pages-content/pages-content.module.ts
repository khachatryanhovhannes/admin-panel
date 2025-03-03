import { Module } from '@nestjs/common';
import { PagesContentController } from './pages-content.controller';
import { PagesContentService } from './pages-content.service';

@Module({
  controllers: [PagesContentController],
  providers: [PagesContentService]
})
export class PagesContentModule {}
