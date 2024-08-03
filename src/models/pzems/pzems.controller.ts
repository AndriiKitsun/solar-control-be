import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CreatePzemDto } from './dto';
import { Pzem } from './entities';
import { PzemsService } from './pzems.service';
import { PzemDtoToSave } from './pzems.types';

@Controller('pzems')
export class PzemsController {
  constructor(private readonly pzemsService: PzemsService) {}

  @Post()
  create(@Body() createPzemDto: CreatePzemDto): Promise<PzemDtoToSave> {
    return this.pzemsService.create(createPzemDto);
  }

  @Get()
  findAll(): Promise<Pzem[]> {
    return this.pzemsService.findAll();
  }

  @Get('health')
  checkHealth(): Promise<string> {
    return this.pzemsService.checkHealth();
  }

  @Delete('counter')
  resetEnergyCounter(): Promise<void> {
    return this.pzemsService.resetEnergyCounter();
  }
}
