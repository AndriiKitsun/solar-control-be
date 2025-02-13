import { Controller, Delete } from '@nestjs/common';
import { PzemsService } from './services';
import { EspPzemCounter } from '@api/modules';

@Controller('pzems')
export class PzemsController {
  constructor(private readonly pzemsService: PzemsService) {}

  @Delete('counter')
  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.pzemsService.resetEnergyCounter();
  }
}
