import { ClassMock } from '@common/types/test.types';
import { ProtectionStrategy } from '@modules/automation/protection-rule/strategies';
import {
  ProtectionMappedRule,
  ProtectionRulesResult,
} from '@modules/automation/protection-rule/protection-rule.types';
import { EspSensorId, EspSensor } from '@api/modules/esp';

export class ProtectionStrategyMock implements ClassMock<ProtectionStrategy> {
  readonly name = EspSensorId.AC_INPUT;

  run(sensor: EspSensor, rules: ProtectionMappedRule): ProtectionRulesResult {
    return {
      acOutputAvgVoltage: true,
    };
  }
}
