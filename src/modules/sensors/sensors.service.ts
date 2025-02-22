import {
  Injectable,
  Inject,
  OnModuleInit,
  Logger,
  MessageEvent,
} from '@nestjs/common';
import { SensorsRepository } from './sensors.repository';
import { Sensor } from './entities';
import { EspSensorsData, ESP_SENSORS_EVENT } from '@api/modules/esp';
import { AppConfig, AppConfigType } from '@config/app.config';
import {
  SensorsAvgVoltageGroup,
  SensorsAvgVoltageConfig,
} from './sensors.types';
import { SENSORS_AVG_VOLTAGE_CONFIG } from './sensors.constants';
import { OnEvent } from '@nestjs/event-emitter';
import { Observable, Subject, map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SensorsService implements OnModuleInit {
  private readonly logger = new Logger(SensorsService.name);
  private readonly sensors$ = new Subject<Sensor>();

  constructor(
    private readonly pzemsRepository: SensorsRepository,
    @Inject(AppConfig.KEY)
    private readonly appConfig: AppConfigType,
  ) {}

  @OnEvent(ESP_SENSORS_EVENT)
  async onSensorsEvent(sensorsMessage: EspSensorsData): Promise<void> {
    const sensors = plainToInstance(Sensor, sensorsMessage, {
      excludeExtraneousValues: true,
    });

    if (!sensors.sensors.length) {
      this.sensors$.next(sensors);

      return;
    }

    try {
      if (isNaN(new Date(sensorsMessage.createdAt).getTime())) {
        throw new Error(`Timestamp '${sensorsMessage.createdAt}' is invalid`);
      }

      const sensor = await this.saveSensors(sensors);

      this.sensors$.next(sensor);
    } catch (err) {
      this.sensors$.next({
        id: '',
        createdAt: new Date().toJSON(),
        sensors: [],
      });

      this.logger.error(err);
    }
  }

  onModuleInit(): void {
    if (this.appConfig.feature.clearPzems) {
      void this.pzemsRepository.clearPzemTable();
    }
  }

  getSensorsData(): Observable<MessageEvent> {
    return this.sensors$.pipe(map((data) => ({ data })));
  }

  async saveSensors(sensorsData: Sensor): Promise<Sensor> {
    await this.calcAvgVoltage(sensorsData, SENSORS_AVG_VOLTAGE_CONFIG);

    return this.pzemsRepository.save(sensorsData);
  }

  async calcAvgVoltage(
    sensorsData: Sensor,
    config: SensorsAvgVoltageConfig,
  ): Promise<void> {
    const period = config.fetchLimit * this.appConfig.feature.pzemCalcPeriod;

    const recentSensors = await this.pzemsRepository.findAllBefore(
      sensorsData.createdAt,
      period,
    );

    const result: Record<string, SensorsAvgVoltageGroup> = {};

    for (const recent of recentSensors) {
      recent.sensors.forEach((pzem) => {
        if (!pzem.name) {
          return;
        }

        if (!result[pzem.name]) {
          result[pzem.name] = { count: 0, sum: 0 };
        }

        const group = result[pzem.name];

        if (group.count >= config.countLimit[pzem.name]) {
          return;
        }

        group.count++;
        group.sum += pzem.voltage!;
      });
    }

    for (const espSensor of sensorsData.sensors) {
      if (!espSensor.name) {
        espSensor.avgVoltage = 0;

        continue;
      }

      const group = result[espSensor.name];

      if (!group || group.count < config.countLimit[espSensor.name]) {
        espSensor.avgVoltage = 0;

        continue;
      }

      espSensor.avgVoltage = group.sum / group.count;
    }
  }
}
