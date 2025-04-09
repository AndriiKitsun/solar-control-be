import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ControlRuleId } from '../enums';

@Entity()
export class ControlRule {
  @PrimaryColumn({ type: 'enum', enum: ControlRuleId })
  id!: ControlRuleId;

  @Column({ type: 'float' })
  scaleUpCheckTime!: number;

  @Column({ type: 'float' })
  scaleUpValue!: number;

  @Column({ type: 'float' })
  scaleDownCheckTime!: number;

  @Column({ type: 'float' })
  scaleDownValue!: number;
}
