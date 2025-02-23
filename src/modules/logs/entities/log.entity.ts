import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { LogType, LogLevel } from '../enums';

@Entity()
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  type!: LogType;

  @Column()
  level!: LogLevel;

  @Column()
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
