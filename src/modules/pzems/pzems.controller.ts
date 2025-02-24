import { Controller, Delete } from '@nestjs/common';
import { PzemsService } from './pzems.service';
import { EspPzemCounter } from '@api/modules/esp';

@Controller('pzems')
export class PzemsController {
  constructor(private readonly pzemsService: PzemsService) {}

  @Delete('counter')
  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.pzemsService.resetEnergyCounter();
  }
}
