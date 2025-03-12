import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensor } from './sensor.entity';
import { Exclude, Expose, Type } from 'class-transformer';
import { SensorProtection } from './sensor-protection.entity';
import { SensorId } from '../enums';

@Entity()
export class SensorItem {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  pid!: string;

  @ManyToOne(() => Sensor, (sensor) => sensor.sensors, { onDelete: 'CASCADE' })
  sensor!: Sensor;

  @Expose()
  @Column({ nullable: true })
  name?: SensorId;

  @Expose()
  @Column({ type: 'float', nullable: true })
  voltage?: number;

  @Expose()
  @Column({ type: 'float', nullable: true })
  avgVoltage?: number;

  @Expose()
  @Column({ type: 'float', nullable: true })
  current?: number;

  @Expose()
  @Column({ type: 'float', nullable: true })
  power?: number;

  @Expose()
  @Column({ type: 'float', nullable: true })
  energy?: number;

  @Expose()
  @Column({ type: 'float', nullable: true })
  frequency?: number;

  @Expose()
  @Column({ type: 'float', nullable: true })
  powerFactor?: number;

  @Expose()
  @Column({ type: 'float', nullable: true })
  t1Energy?: number;

  @Expose()
  @Column({ type: 'float', nullable: true })
  t2Energy?: number;

  @Type(() => SensorProtection)
  @Expose()
  @Column({ type: 'simple-json', nullable: true })
  protection?: SensorProtection;
}
