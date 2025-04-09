import { ClassMock } from '@common/types/test.types';
import { ProtectionStrategy } from '@modules/automation/protection-rule/strategies';
import { SensorId } from '@modules/sensors/enums';
import { SensorItem } from '@modules/sensors/entities';
import {
  ProtectionMappedRule,
  ProtectionRulesResult,
} from '@modules/automation/protection-rule/protection-rule.types';

export class ProtectionStrategyMock implements ClassMock<ProtectionStrategy> {
  readonly name: SensorId = SensorId.AC_INPUT;

  run(sensor: SensorItem, rules: ProtectionMappedRule): ProtectionRulesResult {
    return {
      acOutputAvgVoltage: true,
    };
  }
}
