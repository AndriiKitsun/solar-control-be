import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ProtectionRuleId } from '../enums';
import { Exclude } from 'class-transformer';

@Entity()
export class ProtectionRule {
  @Exclude()
  @PrimaryColumn({ type: 'enum', enum: ProtectionRuleId })
  id!: ProtectionRuleId;

  @Column({ type: 'float' })
  min!: number;

  @Column({ type: 'float' })
  max!: number;

  @Column({ type: 'boolean' })
  enabled!: boolean;
}
