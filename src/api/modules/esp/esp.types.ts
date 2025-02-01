import { components } from './esp.schema';
import { EventEmitter } from 'node:events';

export type EspPzemCounter = components['schemas']['PzemCounter'];
export type EspSensorsData = components['schemas']['SensorsData'];
export type EspSensor = components['schemas']['Sensor'];
export type EspRelayStatus = components['schemas']['RelayStatus'];

export interface EspWsServiceInterface {
  events: EventEmitter;
}
