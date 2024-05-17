// DB entity definition

export class Pzem {
  voltageV: number;
  currentA: number;
  activePowerKw: number;
  activeEnergyKwh: number;
  frequencyHz: number;
  powerFactor: number;
  energyT1Kwh: number;
  energyT2Kwh: number;
  tenMinutesAverageVoltageV: number;
}
