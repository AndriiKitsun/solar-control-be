import { Injectable } from '@nestjs/common';
import { ProtectionRuleDto } from './dto';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { ProtectionRule } from './entities';
import { ProtectionRuleId } from './enums';
import { EspProtectionRulesService } from '@api/modules/esp';
import { OnEvent } from '@nestjs/event-emitter';
import { SENSORS_DATA_EVENT, Sensor } from '../sensors';
import { ProtectionRulesExecutor } from './strategies';

@Injectable()
export class ProtectionRulesService {
  private readonly allowedRulesToSave: ProtectionRuleId[] = [
    ProtectionRuleId.AC_OUTPUT_FREQUENCY,
    ProtectionRuleId.AC_OUTPUT_VOLTAGE,
    ProtectionRuleId.DC_BATTERY_VOLTAGE,
  ];

  constructor(
    private readonly protectionRulesRepository: ProtectionRulesRepository,
    private readonly espProtectionRulesService: EspProtectionRulesService,
    private readonly protectionStrategyExecutor: ProtectionRulesExecutor,
  ) {}

  @OnEvent(SENSORS_DATA_EVENT)
  async onSensorsEvent(sensor: Sensor): Promise<void> {
    if (!sensor.sensors.length) {
      return;
    }

    const rules = await this.protectionRulesRepository.getEnabledRules();

    if (!rules.length) {
      return;
    }

    this.protectionStrategyExecutor.execute(sensor.sensors, rules);
  }

  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRulesRepository.getRules();
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    const rule = await this.protectionRulesRepository.saveRule(id, ruleDto);

    if (this.allowedRulesToSave.includes(id)) {
      await this.espProtectionRulesService.saveProtectionRule({
        id,
        min: ruleDto.min,
        max: ruleDto.max,
        enabled: ruleDto.enabled,
      });
    }

    return rule;
  }
}
