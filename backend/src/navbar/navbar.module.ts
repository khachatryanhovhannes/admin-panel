import { Module } from '@nestjs/common';
import { NavbarService } from './navbar.service';
import { NavbarController } from './navbar.controller';

@Module({
  providers: [NavbarService],
  controllers: [NavbarController]
})
export class NavbarModule {}
