import { Controller, Get, Delete } from '@nestjs/common';
import { PzemsService } from './services';
import { EspPzemCounter } from '@api/modules';

@Controller('pzems')
export class PzemsController {
  constructor(private readonly pzemsService: PzemsService) {}

  @Get('health')
  checkHealth(): Promise<string> {
    return this.pzemsService.checkHealth();
  }

  @Delete('counter')
  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.pzemsService.resetEnergyCounter();
  }
}
