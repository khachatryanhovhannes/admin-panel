import { Module } from '@nestjs/common';
import { TextService } from './text.service';
import { TextController } from './text.controller';

@Module({
  providers: [TextService],
  controllers: [TextController]
})
export class TextModule {}
