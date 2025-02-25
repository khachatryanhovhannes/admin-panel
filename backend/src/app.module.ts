import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LanguageModule } from './language/language.module';
import { MenuModule } from './menu/menu.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { PageModule } from './page/page.module';
import { ContentBlockModule } from './content-block/content-block.module';
import { GlobalContentModule } from './global-content/global-content.module';

@Module({
  imports: [
    PrismaModule,
    LanguageModule,
    MenuModule,
    MenuItemModule,
    PageModule,
    ContentBlockModule,
    GlobalContentModule,
  ],
})
export class AppModule {}
