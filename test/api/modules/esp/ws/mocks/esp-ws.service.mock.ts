import { EspWsServiceInterface } from '@api/modules/esp/esp.types';
import { EventEmitter } from 'node:events';

export class EspWsServiceMock implements EspWsServiceInterface {
  events = new EventEmitter();
}
