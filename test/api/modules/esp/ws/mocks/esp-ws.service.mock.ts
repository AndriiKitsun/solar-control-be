import {
  EspWsServiceInterface,
  EspSensorsData,
} from '@api/modules/esp/esp.types';
import { EventEmitter } from 'node:events';

export class EspWsServiceMock implements EspWsServiceInterface {
  events = new EventEmitter();

  static readonly espPzemDataMock: EspSensorsData = {
    createdAtGmt: '2025-01-19T16:26:30.550Z',
    sensors: [],
  };
}
