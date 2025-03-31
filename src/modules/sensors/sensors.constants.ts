import { SensorsAvgVoltageConfig } from './sensors.types';

export const SENSORS_AVG_VOLTAGE_CONFIG: SensorsAvgVoltageConfig = {
  fetchLimit: 600,
  countLimit: {
    acInput: 600,
    acOutput: 600,
    dcBattery: 50,
  },
};

export const SENSORS_DATA_EVENT = 'sensors:data';
export const SENSORS_DATA_CACHE = 'sensors:data:cache';
