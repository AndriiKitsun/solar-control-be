import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { LogType } from '../enums';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: LogType;

  @Column()
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
