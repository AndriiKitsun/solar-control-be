import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'float', nullable: true, default: 0 })
  t1EnergyCcyPrice?: number;

  @Column({ type: 'float', nullable: true, default: 0 })
  t2EnergyCcyPrice?: number;
}
