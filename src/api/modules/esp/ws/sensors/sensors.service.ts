import { Injectable, Inject, Logger } from '@nestjs/common';
import { EspConfigType, EspConfig } from '@config/esp.config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ESP_SENSORS_EVENT, ESP_SENSORS_CACHE } from '../../constants';
import { EspSensorsData } from './sensors.types';
import { AbstractWsService } from '../../../../services';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class EspSensorsWsService extends AbstractWsService {
  protected override logger = new Logger(EspSensorsWsService.name);

  constructor(
    @Inject(EspConfig.KEY)
    espConfig: EspConfigType,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {
    super(espConfig.wsEndpoint);
  }

  handleMessage(data: EspSensorsData): void {
    this.eventEmitter.emit(ESP_SENSORS_EVENT, data);
    void this.cache.set(ESP_SENSORS_CACHE, data);
  }
}
