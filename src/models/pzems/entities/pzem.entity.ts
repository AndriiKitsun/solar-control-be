import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PzemItem } from './pzem-item.entity';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class Pzem {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', precision: 3 })
  createdAtGmt!: Date;

  @Type(() => PzemItem)
  @OneToMany(() => PzemItem, (item) => item.pzem, { cascade: true })
  pzems!: PzemItem[];
}
