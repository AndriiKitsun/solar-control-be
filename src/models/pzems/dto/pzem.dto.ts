export abstract class PzemDto {
  id!: string;
  voltageV?: number;
  currentA?: number;
  powerKw?: number;
  energyKwh?: number;
  frequencyHz?: number;
  powerFactor?: number;
  t1EnergyKwh?: number;
  t2EnergyKwh?: number;
  avgVoltageV?: number;
}
