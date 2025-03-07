import { Injectable, Inject } from '@nestjs/common';
import { CreateAsicDto, UpdateAsicDto, AsicSummaryResponseDto } from './dto';
import { AsicsRepository } from './asics.repository';
import { AsicsApiService } from '@api/modules';
import { Asic } from './entities';
import { encrypt, decrypt } from '@common/utils';
import { DateMilliseconds } from '@common/enums/date.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PROTECTION_RESULT_KEY } from '../protection-rules/protection-rules.constants';
import { ProtectionResultDto } from '../protection-rules/dto';
import { LogsService } from '../logs/logs.service';
import { LogType } from '../logs/enums';

@Injectable()
export class AsicsService {
  constructor(
    private readonly asicsRepository: AsicsRepository,
    private readonly asicsApiService: AsicsApiService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly logsService: LogsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleStartAsicsCron(): Promise<void> {
    const protection = await this.cache.get<ProtectionResultDto>(
      PROTECTION_RESULT_KEY,
    );

    if (protection?.triggered) {
      return;
    }

    const asics = await this.asicsRepository.findAllT2Active();

    await Promise.allSettled(this.startAsics(asics, LogType.CONTROL));
  }

  async create(createAsicDto: CreateAsicDto): Promise<Asic> {
    const info = await this.asicsApiService.getInfo(createAsicDto.ip);

    const payload: Partial<Asic> = {
      ...createAsicDto,
      password: encrypt(createAsicDto.password),
      hostname: info.system?.network_status.hostname,
    };

    return this.asicsRepository.create(payload);
  }

  findAll(): Promise<Asic[]> {
    return this.asicsRepository.findAll();
  }

  update(id: string, updateAsicDto: UpdateAsicDto): Promise<Asic> {
    if (updateAsicDto.password) {
      updateAsicDto.password = encrypt(updateAsicDto.password);
    }

    return this.asicsRepository.update(id, updateAsicDto);
  }

  delete(id: string): Promise<void> {
    return this.asicsRepository.delete(id);
  }

  async getSummary(id: string): Promise<AsicSummaryResponseDto> {
    const asic = await this.asicsRepository.findOne(id);
    const summary = await this.asicsApiService.getSummary(asic.ip);
    const perfSummary = await this.asicsApiService.getPerfSummary(asic.ip);

    const response: AsicSummaryResponseDto = {
      hostname: asic.hostname,
      ip: asic.ip,
      status: {
        state: summary?.miner_status.miner_state,
        ...this.calcStateTime(summary?.miner_status.miner_state_time),
      },
      avgHashRate: summary?.average_hashrate,
      maxChipTemp: summary?.chip_temp.max,
      powerConsumption: summary?.power_consumption,
      avgFanSpeed: summary?.cooling.fan_duty,
    };

    if (perfSummary?.current_preset?.pretty) {
      response.currentPreset = perfSummary.current_preset.pretty
        .split('~')[1]
        .trim();
    }

    return response;
  }

  calcStateTime(time = 0): AsicSummaryResponseDto['status'] {
    const start = Date.now() - time * 1000;
    const res = Date.now();

    const diff = res - start;

    const days = Math.floor(diff / DateMilliseconds.DAY);
    const hours = Math.floor((diff / DateMilliseconds.HOUR) % 24);
    const minutes = Math.floor((diff / DateMilliseconds.MINUTE) % 60);

    return {
      stateTimeDays: days,
      stateTimeHours: hours,
      stateTimeMinutes: minutes,
    };
  }

  async start(asic: Asic): Promise<void> {
    const token = await this.asicsApiService.login(
      asic.ip,
      decrypt(asic.password),
    );

    return this.asicsApiService.start(asic.ip, token);
  }

  startAsics(asics: Asic[], type: LogType): Promise<void>[] {
    return asics.map((asic) => {
      return this.logsService.runWith(() => this.start(asic), {
        before: {
          type,
          message: `Starting the '${asic.hostname}' Asic miner`,
        },
        after: {
          type,
          message: `The error occurred during starting the '${asic.hostname}' Asic miner`,
        },
      });
    });
  }

  async stop(asic: Asic): Promise<void> {
    const token = await this.asicsApiService.login(
      asic.ip,
      decrypt(asic.password),
    );

    return this.asicsApiService.stop(asic.ip, token);
  }

  stopAsics(asics: Asic[], type: LogType): Promise<void>[] {
    return asics.map((asic) => {
      return this.logsService.runWith(() => this.stop(asic), {
        before: {
          type,
          message: `Stopping the '${asic.hostname}' Asic miner`,
        },
        after: {
          type,
          message: `The error occurred during stopping the '${asic.hostname}' Asic miner`,
        },
      });
    });
  }
}
