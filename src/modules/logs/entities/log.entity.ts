import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { LogType, LogLevel } from '../enums';
import { Exclude } from 'class-transformer';

@Entity()
export class Log {
  @Exclude()
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
