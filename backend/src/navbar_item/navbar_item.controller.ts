import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateNavbarItem, UpdateNavbarItem } from './dto';
import { NavbarItemService } from './navbar_item.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('navbar-item')
export class NavbarItemController {
  constructor(private readonly navbarItemService: NavbarItemService) {}

  @Post()
  create(@Body() createNavbarItemDto: CreateNavbarItem) {
    return this.navbarItemService.create(createNavbarItemDto);
  }

  @Get()
  findAll() {
    return this.navbarItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.navbarItemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNavbarItemDto: UpdateNavbarItem,
  ) {
    return this.navbarItemService.update(+id, updateNavbarItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.navbarItemService.remove(+id);
  }
}
