import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Pzem } from './pzem.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class PzemItem {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  pid!: string;

  @ManyToOne(() => Pzem, (pzem) => pzem.sensors, { onDelete: 'CASCADE' })
  sensor!: Pzem;

  @Column()
  name!: string;

  @Column({ type: 'float', nullable: true })
  voltage?: number;

  @Column({ type: 'float', nullable: true })
  current?: number;

  @Column({ type: 'float', nullable: true })
  power?: number;

  @Column({ type: 'float', nullable: true })
  energy?: number;

  @Column({ type: 'float', nullable: true })
  frequency?: number;

  @Column({ type: 'float', nullable: true })
  powerFactor?: number;

  @Column({ type: 'float', nullable: true })
  t1Energy?: number;

  @Column({ type: 'float', nullable: true })
  t2Energy?: number;

  @Column({ type: 'float', nullable: true })
  avgVoltage?: number;
}
