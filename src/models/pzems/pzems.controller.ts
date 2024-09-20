import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CreatePzemDto } from './dto';
import { Pzem } from './entities';
import { PzemsService } from './services';
import { EspResetPzemCounterResponse } from '@api/modules';

@Controller('pzems')
export class PzemsController {
  constructor(private readonly pzemsService: PzemsService) {}

  @Post()
  create(@Body() createPzemDto: CreatePzemDto): Promise<Pzem> {
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
  resetEnergyCounter(): Promise<EspResetPzemCounterResponse> {
    return this.pzemsService.resetEnergyCounter();
  }
}
