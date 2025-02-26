import { Module } from '@nestjs/common';
import { ConstantService } from './constant.service';
import { ConstantController } from './constant.controller';

@Module({
  providers: [ConstantService],
  controllers: [ConstantController]
})
export class ConstantModule {}
