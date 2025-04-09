import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ProtectionRuleId } from '../enums';

@Entity()
export class ProtectionRule {
  @PrimaryColumn({ type: 'enum', enum: ProtectionRuleId })
  id!: ProtectionRuleId;

  @Column({ type: 'float' })
  min!: number;

  @Column({ type: 'float' })
  max!: number;

  @Column({ type: 'boolean' })
  enabled!: boolean;
}
