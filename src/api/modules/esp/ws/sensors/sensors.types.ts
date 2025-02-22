import { components } from '../../types/esp.schema';

export type EspSensorsData = components['schemas']['SensorsData'];
export type EspSensor = components['schemas']['Sensor'];

export const enum EspSensorId {
  AC_INPUT = 'acInput',
  AC_OUTPUT = 'acOutput',
  DC_BATTERY = 'dcBattery',
}
