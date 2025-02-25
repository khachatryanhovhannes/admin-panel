import { Module } from '@nestjs/common';
import { GlobalContentController } from './global-content.controller';
import { GlobalContentService } from './global-content.service';

@Module({
  controllers: [GlobalContentController],
  providers: [GlobalContentService]
})
export class GlobalContentModule {}
