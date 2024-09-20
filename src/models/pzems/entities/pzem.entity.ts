import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PzemItem } from './pzem-item.entity';

@Entity()
export class Pzem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', precision: 3 })
  createdAtGmt!: Date;

  @OneToMany(() => PzemItem, (item) => item.pzem, {
    nullable: true,
    cascade: true,
  })
  pzems?: PzemItem[];
}
