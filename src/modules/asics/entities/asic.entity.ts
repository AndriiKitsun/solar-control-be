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

  @Expose()
  @Column({ default: false })
  t2Active!: boolean;

  @Expose()
  @Column({ default: false })
  t2EndStop!: boolean;

  @Expose()
  @Column({ default: false })
  automated!: boolean;

  @Expose()
  @Column({ default: false })
  t2Automated!: boolean;
}
