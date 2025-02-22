import { Injectable } from '@nestjs/common';
import { ProtectionRuleDto } from './dto';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { ProtectionRule } from './entities';
import { ProtectionRuleId, ProtectionActionId } from './enums';
import { EspProtectionRulesService } from '@api/modules/esp';
import { OnEvent } from '@nestjs/event-emitter';
import { SENSORS_DATA_EVENT, Sensor } from '../sensors';
import { ProtectionRulesExecutor } from './strategies/protection-rules.executor';

@Injectable()
export class ProtectionRulesService {
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

    const rules = await this.getRules();

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

    if (ruleDto.actions.includes(ProtectionActionId.POWER_OFF)) {
      await this.espProtectionRulesService.saveProtectionRule({
        id: id,
        min: ruleDto.min,
        max: ruleDto.max,
      });
    }

    return rule;
  }
}
