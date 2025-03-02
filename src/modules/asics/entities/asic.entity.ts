import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class Asic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  ip!: string;

  @Column()
  address!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column()
  hostname!: string;

  @Exclude()
  @Column()
  token!: string;

  @Expose()
  @Column({ default: false })
  t2Active!: boolean;
}
