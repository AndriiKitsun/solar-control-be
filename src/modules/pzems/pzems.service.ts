import { Injectable } from '@nestjs/common';
import { EspPzemCounter, EspPzemsApiService } from '@api/modules/esp';

@Injectable()
export class PzemsService {
  constructor(private readonly espPzemsApiService: EspPzemsApiService) {}

  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.espPzemsApiService.resetCounter();
  }
}
