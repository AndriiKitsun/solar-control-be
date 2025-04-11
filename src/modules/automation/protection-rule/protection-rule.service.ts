import { Injectable, Logger, MessageEvent, Inject } from '@nestjs/common';
import { ProtectionRuleDto, ProtectionResultDto } from './dto';
import { ProtectionRuleRepository } from './protection-rule.repository';
import { ProtectionRule } from './entities';
import { ProtectionRuleId } from './enums';
import {
  EspProtectionRulesApiService,
  EspSensorsData,
  ESP_SENSORS_EVENT,
} from '@api/modules/esp';
import { OnEvent } from '@nestjs/event-emitter';
import { AsicsService } from '../../asics/asics.service';
import { LogsService } from '../../logs/logs.service';
import { LogType } from '../../logs/enums';
import { Observable, Subject, map } from 'rxjs';
import { ProtectionStrategyExecutor } from './strategies';
import { PROTECTION_RESULT_KEY } from './protection-rule.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProtectionRuleService {
  private readonly logger = new Logger(ProtectionRuleService.name);
  private readonly protectionResult$ = new Subject<ProtectionResultDto>();

  private isRequestSent = false;

  constructor(
    private readonly protectionRuleRepository: ProtectionRuleRepository,
    private readonly espProtectionRulesApiService: EspProtectionRulesApiService,
    private readonly protectionStrategyExecutor: ProtectionStrategyExecutor,
    private readonly asicsService: AsicsService,
    private readonly logsService: LogsService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
  ) {}

  @OnEvent(ESP_SENSORS_EVENT, { async: true })
  async onSensorsEvent(sensor: EspSensorsData): Promise<void> {
    if (!sensor.sensors.length) {
      return;
    }

    try {
      const rules = await this.protectionRuleRepository.getEnabledRules();

      if (!rules.length) {
        return;
      }

      const result = this.protectionStrategyExecutor.execute(sensor, rules);

      await this.handleProtectionResult(result);
    } catch (err) {
      this.logger.error(err);

      this.logsService.error({
        type: LogType.PROTECTION,
        message: 'The error occurred during handling protection rules',
      });
    }
  }

  async handleProtectionResult(result: ProtectionResultDto): Promise<void> {
    await this.cache.set(PROTECTION_RESULT_KEY, result);

    this.protectionResult$.next(result);

    if (!result.triggered && this.isRequestSent) {
      this.isRequestSent = false;
    }

    if (result.triggered && !this.isRequestSent) {
      this.isRequestSent = true;

      const asics = await this.asicsService.findAll();

      await Promise.allSettled(
        this.asicsService.stopAsics(asics, LogType.PROTECTION),
      );
    }
  }

  getRules(): Promise<ProtectionRule[]> {
    return this.protectionRuleRepository.getRules();
  }

  getProtectionResultStream(): Observable<MessageEvent> {
    return this.protectionResult$.pipe(map((data) => ({ data })));
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    await this.espProtectionRulesApiService.saveProtectionRule(id, ruleDto);

    return this.protectionRuleRepository.saveRule(id, ruleDto);
  }
}
