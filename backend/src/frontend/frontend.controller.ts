import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
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
    console.log(language, slug, pageType);
    return this.frontEndService.getPageData(language, slug, pageType);
  }

  @Get('blog')
  async getBlogData(
    @Query('language') language: string,
    @Query('slug') slug: string,
    @Query('skip', ParseIntPipe) skip = 0,
    @Query('take', ParseIntPipe) take = 10,
  ) {
    return this.frontEndService.getBlogData(language, slug, skip, take);
  }

  @Get('blog/:slug')
  async getBlogPost(
    @Param('slug') slug: string,
    @Query('language') language: string,
  ) {
    return this.frontEndService.getBlogPost(language, slug);
  }
}
