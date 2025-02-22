import { Controller, Get, Put, Body } from '@nestjs/common';
import { EspRelayStatus } from '@api/modules/esp';
import { RelaysService } from './relays.service';
import { UpdateRelayDto } from './dto';

@Controller('relays')
export class RelaysController {
  constructor(private readonly espService: RelaysService) {}

  @Get()
  getRelayStatus(): Promise<EspRelayStatus> {
    return this.espService.getRelayStatus();
  }

  @Put('power')
  updatePowerRelay(@Body() body: UpdateRelayDto): Promise<EspRelayStatus> {
    return this.espService.updatePowerRelay(body.status);
  }
}
