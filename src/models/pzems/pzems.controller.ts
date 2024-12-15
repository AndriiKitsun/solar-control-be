import { Controller, Get, Delete } from '@nestjs/common';
import { PzemsService } from './services';
import { EspResetPzemCounterResponse } from '@api/modules';

@Controller('pzems')
export class PzemsController {
  constructor(private readonly pzemsService: PzemsService) {}

  @Get('health')
  checkHealth(): Promise<string> {
    return this.pzemsService.checkHealth();
  }

  @Delete('counter')
  resetEnergyCounter(): Promise<EspResetPzemCounterResponse> {
    return this.pzemsService.resetEnergyCounter();
  }
}
