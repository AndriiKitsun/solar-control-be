import { Injectable, Logger, MessageEvent, Inject } from '@nestjs/common';
import { ProtectionRuleDto, ProtectionResultDto } from './dto';
import { ProtectionRulesRepository } from './protection-rules.repository';
import { ProtectionRule } from './entities';
import { ProtectionRuleId } from './enums';
import { EspProtectionRulesApiService } from '@api/modules/esp';
import { OnEvent } from '@nestjs/event-emitter';
import { SENSORS_DATA_EVENT } from '../sensors/sensors.constants';
import { Sensor } from '../sensors/entities';
import { AsicsService } from '../asics/asics.service';
import { LogsService } from '../logs/logs.service';
import { LogType } from '../logs/enums';
import { Observable, Subject, map } from 'rxjs';
import { ProtectionRulesExecutor } from './protection-rules.executor';
import { PROTECTION_RESULT_KEY } from './protection-rules.constants';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProtectionRulesService {
  private readonly logger = new Logger(ProtectionRulesService.name);
  private readonly protectionResult$ = new Subject<ProtectionResultDto>();

  private isRequestSent = false;

  constructor(
    private readonly protectionRulesRepository: ProtectionRulesRepository,
    private readonly espProtectionRulesApiService: EspProtectionRulesApiService,
    private readonly protectionStrategyExecutor: ProtectionRulesExecutor,
    private readonly asicsService: AsicsService,
    private readonly logsService: LogsService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
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
    return this.protectionRulesRepository.getRules();
  }

  getProtectionResultStream(): Observable<MessageEvent> {
    return this.protectionResult$.pipe(map((data) => ({ data })));
  }

  async saveRule(
    id: ProtectionRuleId,
    ruleDto: ProtectionRuleDto,
  ): Promise<ProtectionRule> {
    await this.espProtectionRulesApiService.saveProtectionRule(id, ruleDto);

    return this.protectionRulesRepository.saveRule(id, ruleDto);
  }
}
