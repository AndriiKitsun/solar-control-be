import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true, default: 0 })
  t1EnergyCcyPrice?: number;

  @Column({ nullable: true, default: 0 })
  t2EnergyCcyPrice?: number;
}
