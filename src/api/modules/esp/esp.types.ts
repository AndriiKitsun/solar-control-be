import { components } from './esp.schema';
import { EventEmitter } from 'node:events';

export type EspPzemCounter = components['schemas']['PzemCounter'];
export type EspPzemData = components['schemas']['PzemData'];
export type EspPzem = components['schemas']['Pzem'];

export interface EspWsServiceInterface {
  events: EventEmitter;
}
