import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LanguageModule } from './language/language.module';
import { NavbarModule } from './navbar/navbar.module';
import { NavbarItemModule } from './navbar_item/navbar_item.module';
import { TextModule } from './text/text.module';
import { TextContentModule } from './text_content/text_content.module';
import { ConstantModule } from './constant/constant.module';
import { FrontendModule } from './frontend/frontend.module';

@Module({
  imports: [PrismaModule, LanguageModule, NavbarModule, NavbarItemModule, TextModule, TextContentModule, ConstantModule, FrontendModule],
})
export class AppModule {}
