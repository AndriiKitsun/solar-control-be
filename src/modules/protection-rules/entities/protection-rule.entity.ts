import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ProtectionRuleId, ProtectionActionId } from '../enums';

@Entity()
export class ProtectionRule {
  @PrimaryColumn({ type: 'enum', enum: ProtectionRuleId })
  id!: ProtectionRuleId;

  @Column()
  min!: number;

  @Column()
  max!: number;

  @Column({ type: 'enum', enum: ProtectionActionId, array: true })
  actions!: ProtectionActionId[];
}
