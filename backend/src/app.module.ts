import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LanguageModule } from './language/language.module';
import { NavbarModule } from './navbar/navbar.module';
import { NavbarItemModule } from './navbar_item/navbar_item.module';
import { TextModule } from './text/text.module';
import { TextContentModule } from './text_content/text_content.module';
import { ConstantModule } from './constant/constant.module';
import { FrontendModule } from './frontend/frontend.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './images/images.module';
import { PagesModule } from './pages/pages.module';
import { PagesContentModule } from './pages-content/pages-content.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    LanguageModule,
    NavbarModule,
    NavbarItemModule,
    TextModule,
    TextContentModule,
    ConstantModule,
    FrontendModule,
    AuthModule,
    ImagesModule,
    PagesModule,
    PagesContentModule,
  ],
})
export class AppModule {}
