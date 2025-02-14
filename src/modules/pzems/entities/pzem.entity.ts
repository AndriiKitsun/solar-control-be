import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PzemItem } from './pzem-item.entity';
import { Exclude, Type, Expose } from 'class-transformer';

@Entity()
export class Pzem {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Expose()
  @Column({ type: 'timestamptz', precision: 3 })
  createdAtGmt!: Date | string;

  @Expose()
  @Type(() => PzemItem)
  @OneToMany(() => PzemItem, (item) => item.sensor, { cascade: true })
  sensors!: PzemItem[];
}
