import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Asic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  ip: string;
}
