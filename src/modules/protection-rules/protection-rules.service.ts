import { Injectable } from '@nestjs/common';
import { ProtectionRuleDto } from './dto';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { ProtectionRule } from './entities';
import { ProtectionRuleId, ProtectionActionId } from './enums';
import { EspProtectionRulesService } from '@api/modules/esp';
import { OnEvent } from '@nestjs/event-emitter';
import { SENSORS_DATA_EVENT, Sensor } from '../sensors';

@Injectable()
export class ProtectionRulesService {
  constructor(
    private readonly protectionRulesRepository: ProtectionRulesRepository,
    private readonly espProtectionRulesService: EspProtectionRulesService,
  ) {}

  @OnEvent(SENSORS_DATA_EVENT)
  onSensorsEvent(sensor: Sensor): void {
    if (!sensor.sensors.length) {
      return;
    }

    console.log(`sensor -->`, sensor);
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
