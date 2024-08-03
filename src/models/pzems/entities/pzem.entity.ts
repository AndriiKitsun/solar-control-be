import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Pzem {
  @PrimaryColumn({ type: 'timestamptz', precision: 3 })
  createdAtGmt: Date;

  @Column({ type: 'float', default: 0 })
  voltageV: number;

  @Column({ type: 'float', default: 0 })
  currentA: number;

  @Column({ type: 'float', default: 0 })
  powerKw: number;

  @Column({ type: 'float', default: 0 })
  energyKwh: number;

  @Column({ type: 'float', default: 0 })
  frequencyHz: number;

  @Column({ type: 'float', default: 0 })
  powerFactor: number;

  @Column({ type: 'float', default: 0 })
  t1EnergyKwh: number;

  @Column({ type: 'float', default: 0 })
  t2EnergyKwh: number;

  @Column({ type: 'float', default: 0 })
  avgVoltageV: number;
}
