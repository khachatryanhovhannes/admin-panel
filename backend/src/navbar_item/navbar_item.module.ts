import { Module } from '@nestjs/common';
import { NavbarItemService } from './navbar_item.service';
import { NavbarItemController } from './navbar_item.controller';

@Module({
  providers: [NavbarItemService],
  controllers: [NavbarItemController],
})
export class NavbarItemModule {}
