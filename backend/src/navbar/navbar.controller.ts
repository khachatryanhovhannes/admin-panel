import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { NavbarService } from './navbar.service';
import { CreateNavbar } from './dto/create-navbar.dto';
import { UpdateNavbar } from './dto/update-navbar.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('navbar')
export class NavbarController {
  constructor(private readonly navbarService: NavbarService) {}

  @Post()
  create(@Body() createNavbarDto: CreateNavbar) {
    return this.navbarService.create(createNavbarDto);
  }

  @Get()
  findAll() {
    return this.navbarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.navbarService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNavbarDto: UpdateNavbar,
  ) {
    return this.navbarService.update(id, updateNavbarDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.navbarService.remove(id);
  }
}
