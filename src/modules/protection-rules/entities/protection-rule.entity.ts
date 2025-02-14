import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ProtectionRuleId, ProtectionActionId } from '../enums';

@Entity()
export class ProtectionRule {
  @PrimaryColumn()
  id!: ProtectionRuleId;

  @Column()
  min!: number;

  @Column()
  max!: number;

  @Column()
  actions!: ProtectionActionId[];
}
