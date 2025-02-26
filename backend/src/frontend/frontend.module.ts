import { Module } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import { FrontendController } from './frontend.controller';

@Module({
  providers: [FrontendService],
  controllers: [FrontendController]
})
export class FrontendModule {}
