// DB entity definition
export class Pzem {
  voltageV: number;
  currentA: number;
  powerKw: number;
  energyKwh: number;
  frequencyHz: number;
  powerFactor: number;

  t1EnergyKwh: number;
  t2EnergyKwh: number;
  avg10mVoltageV: number;
}
