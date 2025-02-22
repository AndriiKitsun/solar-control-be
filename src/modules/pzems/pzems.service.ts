import { Injectable } from '@nestjs/common';
import { EspPzemCounter, EspPzemsService } from '@api/modules/esp';

@Injectable()
export class PzemsService {
  constructor(private readonly espPzemsService: EspPzemsService) {}

  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.espPzemsService.resetCounter();
  }
}
