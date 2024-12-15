import { components } from './esp.schema';
import { EventEmitter } from 'node:events';

export type EspResetPzemCounterResponse = components['schemas']['PzemCounter'];
export type EspPzemData = components['schemas']['PzemData'];

export interface EspWsServiceInterface {
  events: EventEmitter;
}
