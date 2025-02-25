import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItem } from '@prisma/client';

@Controller('admin/menu-items')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  create(@Body() data: any) {
    // data օրինակ:
    // {
    //   url: "/about",
    //   menu: { connect: { id: 1 } },
    //   parent: { connect: { id: 10 } }, (եթե ունի parent)
    //   translations: {
    //     create: [
    //       { title: "About", language: { connect: { id: 1 } } },
    //       { title: "Մեր մասին", language: { connect: { id: 2 } } },
    //     ]
    //   }
    // }
    return this.menuItemService.create(data);
  }

  @Get()
  findAll(): Promise<MenuItem[]> {
    return this.menuItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<MenuItem> {
    return this.menuItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.menuItemService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuItemService.remove(+id);
  }
}
