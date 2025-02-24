import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { SensorItem } from './sensor-item.entity';
import { Exclude, Type, Expose } from 'class-transformer';

@Entity()
export class Sensor {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose()
  @Column({ type: 'timestamptz', precision: 3 })
  createdAt!: Date | string;

  @Expose()
  @Type(() => SensorItem)
  @OneToMany(() => SensorItem, (item) => item.sensor, { cascade: true })
  sensors!: SensorItem[];
}
