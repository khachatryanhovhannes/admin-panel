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
import { ConstantService } from './constant.service';
import { CreateConstantDto, UpdateConstantDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('constants')
export class ConstantController {
  constructor(private readonly constantsService: ConstantService) {}

  @Post()
  create(@Body() createConstantDto: CreateConstantDto) {
    return this.constantsService.create(createConstantDto);
  }

  @Get()
  findAll() {
    return this.constantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.constantsService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConstantDto: UpdateConstantDto,
  ) {
    return this.constantsService.update(Number(id), updateConstantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.constantsService.remove(Number(id));
  }
}
