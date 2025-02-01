import { Injectable } from '@nestjs/common';
import { EspRelayStatus, EspApiService } from '@api/modules';

@Injectable()
export class RelaysService {
  constructor(private readonly espApiService: EspApiService) {}

  getRelayStatus(): Promise<EspRelayStatus> {
    return this.espApiService.getRelayStatus();
  }

  updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return this.espApiService.updatePowerRelay(status);
  }
}
