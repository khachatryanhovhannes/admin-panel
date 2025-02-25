import { Module } from '@nestjs/common';
import { ContentBlockController } from './content-block.controller';
import { ContentBlockService } from './content-block.service';

@Module({
  controllers: [ContentBlockController],
  providers: [ContentBlockService]
})
export class ContentBlockModule {}
