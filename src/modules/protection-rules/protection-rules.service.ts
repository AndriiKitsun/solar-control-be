import { Injectable, Logger, MessageEvent } from '@nestjs/common';
import { ProtectionRuleDto, ProtectionResultDto } from './dto';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { ProtectionRule } from './entities';
import { ProtectionRuleId } from './enums';
import { EspProtectionRulesApiService } from '@api/modules/esp';
import { OnEvent } from '@nestjs/event-emitter';
import { SENSORS_DATA_EVENT, Sensor } from '../sensors';
import { AsicsApiService } from '@api/modules';
import { AsicsService } from '../asics';
import { LogsService, LogType } from '../logs';
import { Observable, Subject, map } from 'rxjs';
import { ProtectionRulesExecutor } from './protection-rules.executor';
import { ALLOWED_RULES_TO_SAVE } from './protection-rules.constants';

@Injectable()
export class ProtectionRulesService {
  private readonly logger = new Logger(ProtectionRulesService.name);
  private readonly protectionResult$ = new Subject<ProtectionResultDto>();

  private isRequestSent = false;

  constructor(
    private readonly protectionRulesRepository: ProtectionRulesRepository,
    private readonly espProtectionRulesApiService: EspProtectionRulesApiService,
    private readonly protectionStrategyExecutor: ProtectionRulesExecutor,
    private readonly asicsApiService: AsicsApiService,
    private readonly asicsService: AsicsService,
    private readonly logsService: LogsService,
  ) {}

  @OnEvent(SENSORS_DATA_EVENT)
  async onSensorsEvent(sensor: Sensor): Promise<void> {
    if (!sensor.sensors.length) {
      return;
    }

    try {
      const rules = await this.protectionRulesRepository.getEnabledRules();

      if (!rules.length) {
        return;
      }

      const result = this.protectionStrategyExecutor.execute(
        sensor.sensors,
        rules,
      );

      if (!result.triggered && this.isRequestSent) {
        this.isRequestSent = false;
      }

      if (result.triggered && !this.isRequestSent) {
        this.isRequestSent = true;

        await this.stopAllAsics();
      }

      this.protectionResult$.next(result);
    } catch (err) {
      this.logger.error(err);

      this.logsService.error({
        type: LogType.PROTECTION,
        message: 'The error occurred during handling protection rules',
      });
    }
  }

  async stopAllAsics(): Promise<void> {
    const asics = await this.asicsService.findAll();

    for (const asic of asics) {
      this.logsService.debug({
        type: LogType.PROTECTION,
        message: `Stopping the '${asic.hostname}' Asic miner`,
      });

      try {
        await this.asicsApiService.stop(asic.ip, asic.token);
      } catch (err) {
        this.logger.error(err);

        this.logsService.warn({
          type: LogType.PROTECTION,
          message: `The error occurred during stopping the '${asic.hostname}' Asic miner`,
        });
      }
    }
  }

  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRulesRepository.getRules();
  }

  getRulesResult(): Observable<MessageEvent> {
    return this.protectionResult$.pipe(map((data) => ({ data })));
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    if (ALLOWED_RULES_TO_SAVE.includes(id) && ruleDto.enabled) {
      await this.espProtectionRulesApiService.saveProtectionRule({
        id,
        min: ruleDto.min,
        max: ruleDto.max,
      });
    }

    return this.protectionRulesRepository.saveRule(id, ruleDto);
  }
}
