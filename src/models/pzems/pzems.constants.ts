import { SensorsAvgVoltageConfig } from './pzems.types';

export const SENSORS_AVG_VOLTAGE_CONFIG: SensorsAvgVoltageConfig = {
  fetchLimit: 600,
  countLimit: {
    acInput: 600,
    acOutput: 600,
    dcBattery: 50,
  },
};
