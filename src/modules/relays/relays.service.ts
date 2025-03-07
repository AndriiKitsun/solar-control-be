import { Injectable } from '@nestjs/common';
import { EspRelayStatus, EspRelaysApiService } from '@api/modules/esp';
import { LogType } from '../logs/enums';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class RelaysService {
  constructor(
    private readonly espRelaysApiService: EspRelaysApiService,
    private readonly logsService: LogsService,
  ) {}

  getRelayStatus(): Promise<EspRelayStatus> {
    return this.espRelaysApiService.getRelayStatus();
  }

  updatePowerRelay(status: boolean): Promise<EspRelayStatus> {
    return this.espRelaysApiService.updatePowerRelay(status);
  }

  switchPower(status: boolean, type: LogType): Promise<EspRelayStatus | void> {
    return this.logsService.runWith(
      () => this.espRelaysApiService.updatePowerRelay(status),
      {
        before: {
          type,
          message: `Changing power relay status to: ${status ? 'ON' : 'OFF'}`,
        },
        after: {
          type,
          message: `The error occurred during switching power relay status`,
        },
      },
    );
  }
}
