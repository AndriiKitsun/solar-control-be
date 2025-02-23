import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensor } from './sensor.entity';
import { Exclude, Expose } from 'class-transformer';
import { EspSensorId } from '@api/modules/esp';

@Entity()
export class SensorItem {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  pid!: string;

  @ManyToOne(() => Sensor, (sensor) => sensor.sensors, { onDelete: 'CASCADE' })
  sensor!: Sensor;

  @Expose()
  @Column({ nullable: true })
  name?: EspSensorId;

  @Expose()
  @Column({ type: 'float', nullable: true })
  voltage?: number;

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

  @Expose()
  @Column({ type: 'float', nullable: true })
  avgVoltage?: number;
}
