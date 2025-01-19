import {
  Controller,
  Get,
  Delete,
  Post,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { PzemsService } from './services';
import { EspPzemCounter, EspRelayStatus } from '@api/modules';

@Controller('pzems')
export class PzemsController {
  constructor(private readonly pzemsService: PzemsService) {}

  @Delete('counter')
  resetEnergyCounter(): Promise<EspPzemCounter[]> {
    return this.pzemsService.resetEnergyCounter();
  }

  @Get('power')
  getPowerStatus(): Promise<EspRelayStatus> {
    return this.pzemsService.getPowerStatus();
  }

  @Post('power')
  switchPower(
    @Query('status', ParseBoolPipe) status: boolean,
  ): Promise<EspRelayStatus> {
    return this.pzemsService.switchPower(status);
  }
}
