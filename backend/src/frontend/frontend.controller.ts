import { Controller, Get, Query } from '@nestjs/common';
import { FrontendService } from './frontend.service';
import { PageType } from '@prisma/client';

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

  @Get('images')
  async getImages() {
    return this.frontEndService.getImages();
  }

  @Get('pages')
  async getPageData(
    @Query('language') language: string,
    @Query('slug') slug: string,
    @Query('type') pageType: PageType,
  ) {
    return this.frontEndService.getPageData(language, slug, pageType);
  }
}
