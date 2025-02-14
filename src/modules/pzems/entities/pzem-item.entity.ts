import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pzem } from './pzem.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class PzemItem {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  pid!: string;

  @ManyToOne(() => Pzem, (pzem) => pzem.sensors, { onDelete: 'CASCADE' })
  sensor!: Pzem;

  @Expose()
  @Column({ nullable: true })
  name?: string;

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
