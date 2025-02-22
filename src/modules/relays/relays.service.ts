import { Injectable } from '@nestjs/common';
import { EspRelayStatus, EspRelaysService } from '@api/modules/esp';

@Injectable()
export class RelaysService {
  constructor(private readonly espRelaysService: EspRelaysService) {}

  getRelayStatus(): Promise<EspRelayStatus> {
    return this.espRelaysService.getRelayStatus();
  }

  updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return this.espRelaysService.updatePowerRelay(status);
  }
}
