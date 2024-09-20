import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pzem } from './pzem.entity';

@Entity()
export class PzemItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pzem, (pzem) => pzem.pzems)
  pzem!: Pzem;

  @Column()
  name!: string;

  @Column({ type: 'float', nullable: true })
  voltageV?: number;

  @Column({ type: 'float', nullable: true })
  currentA?: number;

  @Column({ type: 'float', nullable: true })
  powerKw?: number;

  @Column({ type: 'float', nullable: true })
  energyKwh?: number;

  @Column({ type: 'float', nullable: true })
  frequencyHz?: number;

  @Column({ type: 'float', nullable: true })
  powerFactor?: number;

  @Column({ type: 'float', nullable: true })
  t1EnergyKwh?: number;

  @Column({ type: 'float', nullable: true })
  t2EnergyKwh?: number;

  @Column({ type: 'float', nullable: true })
  avgVoltageV?: number;
}
