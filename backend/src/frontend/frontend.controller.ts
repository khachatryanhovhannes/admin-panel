import { Controller, Get } from '@nestjs/common';
import { FrontendService } from './frontend.service';

@Controller('frontend')
export class FrontendController {
  constructor(private readonly frontEndService: FrontendService) {}

  @Get('navigation')
  async getNavigation() {
    return this.frontEndService.getNavigation();
  }

  @Get('languages')
  async getAllLanguages() {
    return this.frontEndService.getAllLanguages();
  }

  @Get('content')
  async getContent() {
    return this.frontEndService.getContent();
  }
}
